"use client"
import CardWrapper from "~/components/card-wrapper"
import { useAtom, useSetAtom } from "jotai"
import {
  daoFormsAtom,
  type DaoInformationForms,
  daoInformationFormsSchema,
  stepAtom
} from "~/store/create-dao-store"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useTransition } from "react"
import { Form } from "~/components/ui/form"
import { Button } from "~/components/ui/button"
import { ImagePlus, Loader2, TrashIcon, Wallet } from "lucide-react"
import PictureSelectPopover from "~/components/picture-select-popover"
import {
  LaunchNativeSteps,
  LaunchNoNativeSteps,
  UPLOAD_PATH_POST
} from "~/lib/const"
import { uploadFile } from "~/app/actions"
import { cn } from "~/lib/utils"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select"
import { DaoType } from "@prisma/client"
import { useRouter } from "next/navigation"
import { api } from "~/trpc/react"
import { z } from "zod"
import { MultiStepLoader } from "~/components/ui/multi-step-loader"
import { formatUnits } from "viem"
import {
  useApprovedTransaction,
  useDataPersistence,
  useLaunchStepState,
  useLaunchTransaction
} from "~/hooks/use-create"

const InformationForm = () => {
  const setStep = useSetAtom(stepAtom)
  const { mutateAsync } = api.dao.checkNameAndTickerExists.useMutation()
  const [daoForms, setDaoForms] = useAtom(daoFormsAtom)
  const form = useForm<DaoInformationForms>({
    resolver: zodResolver(
      daoInformationFormsSchema.superRefine(async (data, ctx) => {
        const result = await mutateAsync({
          name: data.name,
          ticker: data.ticker
        })

        if (result[0]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This name already exists",
            path: ["name"]
          })
        }

        if (result[1]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This ticker already exists",
            path: ["ticker"]
          })
        }
      }),
    ),
    reValidateMode: "onBlur",
    defaultValues: { ...daoForms }
  })

  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = form
  const { data: assetList = [], isPending } =
    api.assetToken.getAssetTokens.useQuery()
  const assetAddress = watch("assetAddress")
  const assetSteps = useMemo(() => {
    if (!assetAddress || assetList.length === 0) {
      return []
    }
    const selectedAsset = assetList.find(
      (asset) => asset.address === assetAddress,
    )
    if (!selectedAsset) {
      return []
    }
    return selectedAsset.isNative ? LaunchNativeSteps : LaunchNoNativeSteps
  }, [assetAddress, assetList])
  const currentAsset = useMemo(() => {
    if (!assetAddress || assetList.length === 0) {
      return
    }
    return assetList.find((asset) => asset.address === assetAddress)
  }, [assetAddress, assetList])
  const {
    launchStepState,
    updateDescription,
    initStep,
    nextStep,
    errorStep,
    exitStep,
    finallyStep
  } = useLaunchStepState()
  const [isVerifying, startVerify] = useTransition()
  const onError = (error: unknown) => {
    console.log("error", launchStepState)
    console.error(error)
    errorStep()
    throw error
  }

  const { execute: approvedTransaction } = useApprovedTransaction({
    onApproveMessage: updateDescription,
    onApproveError: onError
  })
  const { execute: launchTransaction } = useLaunchTransaction({
    onLaunchMessage: updateDescription,
    onLaunchError: onError
  })
  const { execute: dataPersistence } = useDataPersistence({
    onPersistenceMessage: updateDescription,
    onPersistenceError: onError
  })
  const submit = (data: DaoInformationForms) => {
    console.log("submit", data)
    setDaoForms({
      ...daoForms,
      ...data
    })
    initStep()
    startVerify(async () => {
      try {
        if (!currentAsset?.isNative) {
          await approvedTransaction(currentAsset)
          nextStep()
        }
        const tokenId = await launchTransaction(currentAsset)
        nextStep()
        await dataPersistence(tokenId)
        finallyStep()
        setStep("FINISH")
        router.push("/create/finish")
      } catch (e) {}
    })
  }
  return (
    <CardWrapper
      className={"col-span-1 w-full md:col-span-2"}
      contentClassName={"bg-card "}
    >
      <MultiStepLoader
        loadingStates={assetSteps}
        errorState={launchStepState.error}
        visible={launchStepState.showSteps}
        currentState={launchStepState.now}
        description={launchStepState.description}
        progressState={launchStepState.progress}
        onClose={exitStep}
        onFinish={() => {
          exitStep()
          router.push("/create/finish")
        }}
      />

      <Form {...form}>
        <form
          className={"grid w-full grid-cols-4 gap-10 overflow-hidden p-9"}
          onSubmit={(e) => {
            console.log("Form submit event triggered")
            e.preventDefault()
            void handleSubmit(submit)(e)
            console.log("handleSubmit result:")
          }}
        >
          <div className="col-span-4 space-y-4 lg:col-span-1">
            <div className="flex flex-col gap-4">Avatar</div>
            <Controller
              control={control}
              name="avatar"
              render={({ field }) => {
                return field.value ? (
                  <div className="flex gap-2 lg:flex-col">
                    <div
                      className="w-1/2 rounded-xl bg-gray-700 bg-cover bg-center bg-no-repeat shadow lg:w-full"
                      style={{
                        backgroundImage: `url(${field.value})`,
                        aspectRatio: "1 / 1"
                      }}
                    ></div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={() => {
                        field.onChange("")
                      }}
                    >
                      <TrashIcon className="mx-auto h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <PictureSelectPopover
                    onSelect={(url) => {
                      field.onChange(url)
                    }}
                    uploadPath={UPLOAD_PATH_POST}
                    onUpload={uploadFile}
                  >
                    <button
                      className={cn(
                        "flex h-36 w-36 flex-col items-center justify-center rounded-full border border-dashed",
                        errors.avatar?.message
                          ? "border-destructive"
                          : "border-input",
                        "border-primary",
                      )}
                    >
                      <ImagePlus className="text-muted-foreground h-14 w-14" />
                    </button>
                  </PictureSelectPopover>
                )
              }}
            />
            <p className="text-destructive mt-2 text-sm">
              {!watch("avatar") &&
                errors.avatar?.message &&
                "Avatar is required"}
            </p>
          </div>
          <div className="col-span-4 grid grid-cols-3 gap-8 lg:col-span-3">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    {...field}
                    id="name"
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.name ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.name?.message &&
                      (errors.name.message === "Required"
                        ? "Name is required."
                        : errors.name.message)}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="ticker"
              render={({ field }) => (
                <div className="col-span-1 space-y-2">
                  <Label htmlFor="ticker">Ticker</Label>
                  <div className="relative">
                    <p className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 font-light">
                      $
                    </p>
                    <Input
                      {...field}
                      id="ticker"
                      className={cn(
                        "h-12 bg-transparent pl-8 text-lg uppercase",
                        errors.ticker ? "border-destructive" : "border-input",
                        "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                      )}
                      disabled={isVerifying}
                      onChange={(v) => {
                        field.onChange(v.target.value)
                      }}
                    />
                  </div>
                  <p className="text-destructive mt-2 text-sm">
                    {errors.ticker?.message &&
                      (errors.ticker.message === "Required"
                        ? "Ticker is required."
                        : errors.ticker.message)}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-12 bg-transparent text-lg",
                        errors.type ? "border-destructive" : "border-input",
                        "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                      )}
                    >
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        className={"h-12 text-lg"}
                        value={DaoType.CODE}
                      >
                        CODE
                      </SelectItem>
                      <SelectItem
                        className={"h-12 text-lg"}
                        value={DaoType.DATASET}
                      >
                        DATASET
                      </SelectItem>
                      <SelectItem
                        className={"h-12 text-lg"}
                        value={DaoType.MODEL}
                      >
                        MODEL
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-destructive mt-2 text-sm">
                    {errors.type?.message}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    {...field}
                    id="description"
                    className={cn(
                      "h-40 resize-none bg-transparent text-lg",
                      errors.description
                        ? "border-destructive"
                        : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.description?.message && "Description is required"}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="x"
              render={({ field }) => (
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="x">
                    Twitter / X
                    <span className="text-muted-foreground pl-4 text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    {...field}
                    id="x"
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.x ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                    value={field.value ?? ""}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.x?.message}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="telegram"
              render={({ field }) => (
                <div className="col-span-3 space-y-4">
                  <Label htmlFor="telegram">
                    Telegram
                    <span className="text-muted-foreground pl-4 text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    {...field}
                    id="telegram"
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.telegram ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                    value={field.value ?? ""}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.telegram?.message}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="website"
              render={({ field }) => (
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="website">
                    Website
                    <span className="text-muted-foreground pl-4 text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    {...field}
                    id="website"
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.website ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                    value={field.value ?? ""}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.website?.message}
                  </p>
                </div>
              )}
            />
          </div>
          <div className={"col-span-3"}>
            <Controller
              control={control}
              name="assetAddress"
              render={({ field }) => (
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="assetAddress">Asset Token</Label>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                    value={field.value || ""}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-12 bg-transparent text-lg",
                        errors.assetAddress
                          ? "border-destructive"
                          : "border-input",
                        "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                      )}
                    >
                      <SelectValue placeholder="Select asset token">
                        {currentAsset?.symbol ?? "No asset"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {isPending ? (
                        <div className="flex items-center justify-center p-2">
                          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900"></div>
                        </div>
                      ) : assetList && assetList.length > 0 ? (
                        assetList.map((token) => (
                          <SelectItem
                            key={`at-${token.name}-${token.symbol}`}
                            value={token.address}
                            className="h-12 text-lg"
                          >
                            {token.symbol}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-muted-foreground px-2 py-2 text-sm">
                          No asset available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {currentAsset?.symbol && (
                    <p className={"text-muted-foreground text-sm font-thin"}>
                      Launch Fee{" "}
                      <span className={"font-bold"}>
                        {formatUnits(
                          BigInt(currentAsset?.launchFee.toString()),
                          currentAsset?.decimals,
                        )}{" "}
                        {currentAsset?.symbol}
                      </span>
                    </p>
                  )}
                  <p className="text-destructive mt-2 text-sm">
                    {errors.assetAddress?.message}
                  </p>
                </div>
              )}
            />
          </div>
          <div className="col-span-4 flex items-center justify-center">
            <Button
              className="h-16 w-full max-w-48 rounded-lg py-8 text-lg font-bold [&_svg]:size-6"
              type="submit"
              disabled={isVerifying}
            >
              {isVerifying || isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wallet className="" />
              )}
              Next
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default InformationForm
