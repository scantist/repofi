"use client"
import {decodeEventLog, erc20Abi, formatUnits, getAddress, parseEther} from "viem"
import CardWrapper from "~/components/card-wrapper"
import {Form} from "~/components/ui/form"
import {daoFormsAtom, stepAtom} from "~/store/create-dao-store"
import {Controller, useForm} from "react-hook-form"
import {type LaunchParams, launchSchema} from "~/lib/schema"
import {zodResolver} from "@hookform/resolvers/zod"
import {useRouter} from "next/navigation"
import {useEffect, useMemo, useState, useTransition} from "react"
import {Label} from "~/components/ui/label"
import {Input} from "~/components/ui/input"
import {cn} from "~/lib/utils"
import {api} from "~/trpc/react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select"
import {Button} from "~/components/ui/button"
import {Loader2, Rocket} from "lucide-react"
import {LaunchNativeSteps, LaunchNoNativeSteps} from "~/lib/const"
import {MultiStepLoader} from "~/components/ui/multi-step-loader"

import {readContract, simulateContract, waitForTransactionReceipt, writeContract} from "@wagmi/core"
import {useAccount, useConfig} from "wagmi"
import {defaultChain} from "~/lib/web3"
import {env} from "~/env"
import launchPadAbi from "~/lib/abi/LaunchPad.json"
import {useAtom} from "jotai"

const Launch = () => {
  const [daoInformation, setDaoInformation] = useAtom(daoFormsAtom)
  const [launchStep, setLaunchStep] = useAtom(stepAtom)
  useEffect(() => {
    setLaunchStep("INFORMATION")
  }, [])
  const form = useForm<LaunchParams>({
    resolver: zodResolver(launchSchema, {async: true}),
    reValidateMode: "onBlur"
  })
  const router = useRouter()
  const {data: assetTokenOptions, isPending} = api.assetToken.getAssetTokens.useQuery()

  const {mutateAsync: createMutate} = api.dao.create.useMutation()

  const {
    handleSubmit,
    control,
    formState: {errors},
    watch
  } = form
  const [isVerifying, startVerify] = useTransition()
  const reservedRatio = watch("reservedRatio")
  const salesRatio = watch("salesRatio")

  const liquidityPoolRatio = useMemo(() => {
    if (typeof reservedRatio === "number" && typeof salesRatio === "number") {
      const calculatedRatio = 100 - reservedRatio - salesRatio
      return calculatedRatio >= 0 ? calculatedRatio : 0
    }
    return undefined
  }, [reservedRatio, salesRatio])
  const assetToken = watch("assetToken")

  const currentAssetToken = useMemo(() => {
    return assetTokenOptions?.find((option) => option.address === assetToken)
  }, [assetToken])
  const stepState = useMemo(() => {
    if (!currentAssetToken) {
      return []
    }
    return currentAssetToken.isNative ? LaunchNativeSteps : LaunchNoNativeSteps
  }, [currentAssetToken])
  const [showSteps, setShowSteps] = useState(false)

  const [currentStep, setCurrentStep] = useState<{
    now: number
    progress: number
    error: number
  }>({
    now: 0,
    progress: -1,
    error: -1
  })
  const {address} = useAccount()
  const config = useConfig()
  const [description, setDescription] = useState<string | boolean>()
  const contractAddress = env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS

  const approveAssetToken = async () => {
    if (address && currentAssetToken) {
      setDescription("checking allowance...")
      const allowance = await readContract(config, {
        abi: erc20Abi,
        address: currentAssetToken.address as `0x${string}`,
        chainId: defaultChain.id,
        functionName: "allowance",
        args: [address, env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS]
      })
      const launchFee = BigInt(currentAssetToken.launchFee.toString())
      if (allowance >= launchFee) {
        return true
      }
      setDescription("approving allowance...")
      const {request, result} = await simulateContract(config, {
        abi: erc20Abi,
        address: currentAssetToken.address as `0x${string}`,
        functionName: "approve",
        args: [contractAddress, launchFee],
        account: address
      })
      if (!result) {
        return false
      }
      try {
        const hash = await writeContract(config, request)
        await waitForTransactionReceipt(config, {hash})
        return await approveAssetToken()
      } catch (error) {
        console.error(error)
        return false
      }
    }
  }

  const launchDaoToken = async (data: LaunchParams): Promise<[bigint, boolean]> => {
    const salesRatio = BigInt(data.salesRatio * 100)
    const reservedRatio = BigInt(data.reservedRatio * 100)
    if (address && currentAssetToken) {
      let amount = 0n
      if (currentAssetToken.isNative) {
        amount = parseEther(formatUnits(BigInt(currentAssetToken.launchFee.toString()), currentAssetToken.decimals))
      }
      const {request} = await simulateContract(config, {
        abi: launchPadAbi,
        address: contractAddress,
        functionName: "launch",
        args: [daoInformation.name, daoInformation.ticker, data.totalSupply, data.raisedAssetAmount, salesRatio, reservedRatio, currentAssetToken.address as `0x${string}`],
        account: address,
        value: amount
      })
      const hash = await writeContract(config, request)
      console.log("hash", hash)

      const receipt = await waitForTransactionReceipt(config, {
        hash
      })
      console.log("hash", hash)

      console.log("receipt", receipt)
      console.log("receipt", receipt.logs)

      const logs = receipt.logs
      const item = logs.find((log) => getAddress(log.address) === contractAddress)

      if (!item) {
        console.log("Failed to find launch event")
        return [0n, false]
      }
      const {args} = decodeEventLog({
        ...item,
        abi: launchPadAbi
      })
      const {
        asset,
        tokenId,
        initialPrice
      } = args as unknown as {
        asset: `0x${string}`
        tokenId: bigint
        initialPrice: bigint
      }

      if (!asset || !tokenId || !initialPrice) {
        console.log("Failed to parse launch event")
        return [0n, false]
      }
      return [tokenId, true]
    }
    return [0n, false]
  }

  const submit = async (data: LaunchParams) => {
    setDescription(false)
    if (address && currentAssetToken) {
      let tempCurrentStep = 0
      setShowSteps(true)
      setCurrentStep({now: tempCurrentStep, error: -1, progress: tempCurrentStep})
      startVerify(async () => {
        try {
          if (!currentAssetToken.isNative) {
            if (!(await approveAssetToken())) {
              throw new Error("Approve asset token failed")
            }
          }
          tempCurrentStep += 1
          setCurrentStep({now: tempCurrentStep, error: -1, progress: tempCurrentStep})

          const [tokenId, flag] = await launchDaoToken(data)
          if (!flag) {
            throw new Error("Launch DAO token failed")
          }
          tempCurrentStep += 1
          setCurrentStep({now: tempCurrentStep, error: -1, progress: tempCurrentStep})
          await createMutate({
            ...daoInformation,
            tokenId
          })
          setCurrentStep({
            now: tempCurrentStep,
            error: -1,
            progress: -1
          })
        } catch (e) {
          console.error(e)
          setCurrentStep({
            now: tempCurrentStep,
            error: tempCurrentStep,
            progress: -1
          })
        }
      })
    }
  }
  return (
    <CardWrapper className={"col-span-1 w-auto md:col-span-2"} contentClassName={"bg-card "}>
      <MultiStepLoader
        loadingStates={stepState}
        errorState={currentStep.error}
        visible={showSteps}
        currentState={currentStep.now}
        description={description}
        progressState={currentStep.progress}
        onClose={() => {
          setShowSteps(false)
          setCurrentStep({
            now: 0,
            error: -1,
            progress: -1
          })
        }}
        onFinish={() => {
          setShowSteps(false)
          setTimeout(() => {
            router.push("/create/finish")
          }, 1000)
        }}
      />
      <Form {...form}>
        <form
          className={"grid w-full grid-cols-3 gap-10 overflow-hidden p-9"}
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(submit)(e)
          }}
        >
          <div className={"col-span-3"}>
            <Controller
              control={control}
              name="totalSupply"
              render={({field}) => (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="totalSupply">Total Supply</Label>
                  <Input
                    {...field}
                    value={field.value ? `${field.value}` : ""}
                    id="totalSupply"
                    type={"number"}
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.totalSupply ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary"
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      const value = v.target.value.trim()
                      if (value === "") {
                        field.onChange(undefined)
                      } else {
                        try {
                          const bigIntValue = BigInt(value)
                          field.onChange(bigIntValue)
                        } catch (error) {
                          // 如果转换失败，可以设置一个错误状态或者保持原来的值
                          console.error("Invalid BigInt value:", error)
                        }
                      }
                    }}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.totalSupply?.message && (errors.totalSupply.message === "Required" ? "Total supply is required." : errors.totalSupply.message)}
                  </p>
                </div>
              )}
            />
          </div>
          <div className={"col-span-3"}>
            <Controller
              control={control}
              name="raisedAssetAmount"
              render={({field}) => (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="raisedAssetAmount">Raised Asset Amount</Label>
                  <Input
                    {...field}
                    value={field.value ? `${field.value}` : ""}
                    id="raisedAssetAmount"
                    type={"number"}
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.raisedAssetAmount ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary"
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      const value = v.target.value.trim()
                      if (value === "") {
                        field.onChange(undefined)
                      } else {
                        try {
                          const bigIntValue = BigInt(value)
                          field.onChange(bigIntValue)
                        } catch (error) {
                          // 如果转换失败，可以设置一个错误状态或者保持原来的值
                          console.error("Invalid BigInt value:", error)
                        }
                      }
                    }}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.raisedAssetAmount?.message && (errors.raisedAssetAmount.message === "Required" ? "Raised Asset Amount is required." : errors.raisedAssetAmount.message)}
                  </p>
                </div>
              )}
            />
          </div>
          <div className={"col-span-1"}>
            <Controller
              control={control}
              name="salesRatio"
              render={({field}) => (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="salesRatio">Sales Ratio</Label>
                  <div className="relative">
                    <Input
                      {...field}
                      value={field.value ? `${field.value}` : ""}
                      id="salesRatio"
                      type="number"
                      max={99.99}
                      min={0}
                      step={0.01}
                      className={cn(
                        "h-12 bg-transparent pr-8 text-lg",
                        errors.salesRatio ? "border-destructive" : "border-input",
                        "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary"
                      )}
                      disabled={isVerifying}
                      onChange={(v) => {
                        const value = v.target.value.trim()
                        if (value === "") {
                          field.onChange(undefined)
                        } else {
                          try {
                            const numberValue = Number(Number.parseFloat(value).toFixed(2))
                            field.onChange(numberValue)
                          } catch (error) {
                            console.error("Invalid number value:", error)
                          }
                        }
                      }}
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-destructive mt-2 text-sm">
                    {errors.salesRatio?.message && (errors.salesRatio.message === "Required" ? "Sales Ratio is required." : errors.salesRatio.message)}
                  </p>
                </div>
              )}
            />
          </div>
          <div className={"col-span-1"}>
            <Controller
              control={control}
              name="reservedRatio"
              render={({field}) => (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="reservedRatio">Reserved Ratio</Label>
                  <div className="relative">
                    <Input
                      {...field}
                      value={field.value ? `${field.value}` : ""}
                      id="reservedRatio"
                      type="number"
                      max={99.99}
                      min={0}
                      step={0.01}
                      className={cn(
                        "h-12 bg-transparent pr-8 text-lg",
                        errors.reservedRatio ? "border-destructive" : "border-input",
                        "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary"
                      )}
                      disabled={isVerifying}
                      onChange={(v) => {
                        const value = v.target.value.trim()
                        if (value === "") {
                          field.onChange(undefined)
                        } else {
                          try {
                            const numberValue = Number(Number.parseFloat(value).toFixed(2))
                            field.onChange(numberValue)
                          } catch (error) {
                            console.error("Invalid number value:", error)
                          }
                        }
                      }}
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-destructive mt-2 text-sm">
                    {errors.reservedRatio?.message && (errors.reservedRatio.message === "Required" ? "Reserved Ratio is required." : errors.reservedRatio.message)}
                  </p>
                </div>
              )}
            />
          </div>
          <div className={"col-span-1"}>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="liquidityPoolRatio">Liquidity Pool Ratio</Label>
              <div className="relative">
                <Input
                  className={cn("border-input h-12 bg-transparent pr-8 text-lg", "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary")}
                  value={liquidityPoolRatio !== undefined ? liquidityPoolRatio.toFixed(2) : ""}
                  id="liquidityPoolRatio"
                  type="text"
                  disabled={true}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>
          <div className={"col-span-3"}>
            <div className={"col-span-3"}>
              <Controller
                control={control}
                name="assetToken"
                render={({field}) => (
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="assetToken">Asset Token</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                      <SelectTrigger
                        className={cn(
                          "h-12 bg-transparent text-lg",
                          errors.assetToken ? "border-destructive" : "border-input",
                          "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary"
                        )}
                      >
                        <SelectValue placeholder="Select asset token"/>
                      </SelectTrigger>
                      <SelectContent>
                        {isPending ? (
                          <div className="flex items-center justify-center p-2">
                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900" />
                          </div>
                        ) : assetTokenOptions && assetTokenOptions.length > 0 ? (
                          assetTokenOptions.map((token) => (
                            <SelectItem key={`at-${token.name}-${token.symbol}`} value={`${token.address}`}
                                        className="h-12 text-lg">
                              {token.symbol}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No asset tokens available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {currentAssetToken && (
                      <p className={"text-muted-foreground text-sm font-thin"}>
                        {/*Launch Fee <span*/}
                        {/*className={"font-bold"}>{formatUnits(currentAssetToken.launchFee, currentAssetToken.decimals)} {currentAssetToken.symbol}</span>*/}
                      </p>
                    )}
                    <p className="text-destructive mt-2 text-sm">{errors.assetToken?.message}</p>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <Button className="h-16 w-full max-w-80 rounded-lg py-8 text-lg font-bold [&_svg]:size-6" type="submit"
                    disabled={isVerifying}>
              {isVerifying ? <Loader2 className="animate-spin"/> : <Rocket className=""/>}
              Launch
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default Launch
