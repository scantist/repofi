"use client"

import CardWrapper from "~/components/card-wrapper"
import { Form } from "~/components/ui/form"
import { useStore } from "jotai/index"
import { createDaoAtom, launchAtom } from "~/store/create-dao-store"
import { Controller, useForm } from "react-hook-form"
import {
  CreateDaoParams,
  createDaoParamsSchema,
  type LaunchParams,
  launchSchema
} from "~/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useMemo, useTransition } from "react"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Button } from "~/components/ui/button"
import { Loader2, Rocket, Wallet } from "lucide-react"

const Launch = () => {
  const store = useStore()
  const launchState = store.get(launchAtom)
  const form = useForm<LaunchParams>({
    resolver: zodResolver(launchSchema, { async: true }),
    reValidateMode: "onBlur"
  })
  const router = useRouter()
  // TODO
  // const { data: assetTokenOptions, isPending } = api.assetToken.getAssetTokens.useQuery()
  // console.log("assetTokenOptions", assetTokenOptions)
  const {
    handleSubmit,
    control,
    formState: { errors },
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

  const submit = (data: LaunchParams) => {
    // TODO
  }
  return (
    <CardWrapper className={"bg-card col-span-1 w-full md:col-span-2"}>
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
              render={({ field }) => (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="totalSupply">Total Supply</Label>
                  <Input
                    {...field}
                    value={field.value ? `${field.value}` : ""}
                    id="totalSupply"
                    type={"number"}
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.totalSupply
                        ? "border-destructive"
                        : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
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
                    {errors.totalSupply?.message &&
                      (errors.totalSupply.message === "Required"
                        ? "Total supply is required."
                        : errors.totalSupply.message)}
                  </p>
                </div>
              )}
            />
          </div>
          <div className={"col-span-3"}>
            <Controller
              control={control}
              name="raisedAssetAmount"
              render={({ field }) => (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="raisedAssetAmount">Raised Asset Amount</Label>
                  <Input
                    {...field}
                    value={field.value ? `${field.value}` : ""}
                    id="raisedAssetAmount"
                    type={"number"}
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.raisedAssetAmount
                        ? "border-destructive"
                        : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
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
                    {errors.raisedAssetAmount?.message &&
                      (errors.raisedAssetAmount.message === "Required"
                        ? "Raised Asset Amount is required."
                        : errors.raisedAssetAmount.message)}
                  </p>
                </div>
              )}
            />
          </div>
          <div className={"col-span-1"}>
            <Controller
              control={control}
              name="salesRatio"
              render={({ field }) => (
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
                      className={cn(
                        "h-12 bg-transparent text-lg pr-8",
                        errors.salesRatio
                          ? "border-destructive"
                          : "border-input",
                        "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                      )}
                      disabled={isVerifying}
                      onChange={(v) => {
                        const value = v.target.value.trim()
                        if (value === "") {
                          field.onChange(undefined)
                        } else {
                          try {
                            const numberValue = Number(value)
                            field.onChange(numberValue)
                          } catch (error) {
                            console.error("Invalid number value:", error)
                          }
                        }
                      }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-destructive mt-2 text-sm">
                    {errors.salesRatio?.message &&
                      (errors.salesRatio.message === "Required"
                        ? "Sales Ratio is required."
                        : errors.salesRatio.message)}
                  </p>
                </div>
              )}
            />
          </div>
          <div className={"col-span-1"}>
            <Controller
              control={control}
              name="reservedRatio"
              render={({ field }) => (
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
                      className={cn(
                        "h-12 bg-transparent text-lg pr-8",
                        errors.reservedRatio
                          ? "border-destructive"
                          : "border-input",
                        "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                      )}
                      disabled={isVerifying}
                      onChange={(v) => {
                        const value = v.target.value.trim()
                        if (value === "") {
                          field.onChange(undefined)
                        } else {
                          try {
                            const numberValue = Number(value)
                            field.onChange(numberValue)
                          } catch (error) {
                            console.error("Invalid number value:", error)
                          }
                        }
                      }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-destructive mt-2 text-sm">
                    {errors.reservedRatio?.message &&
                      (errors.reservedRatio.message === "Required"
                        ? "Reserved Ratio is required."
                        : errors.reservedRatio.message)}
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
                  className={cn(
                    "h-12 bg-transparent text-lg pr-8 border-input",
                    "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                  )}
                  value={liquidityPoolRatio !== undefined ? liquidityPoolRatio.toFixed(2) : ""}
                  id="liquidityPoolRatio"
                  type="text"
                  disabled={true}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>
          {/*<div className={"col-span-3"}>*/}
          {/*  <div className={"col-span-3"}>*/}
          {/*    <Controller*/}
          {/*      control={control}*/}
          {/*      name="assetToken"*/}
          {/*      render={({ field }) => (*/}
          {/*        <div className="col-span-3 space-y-2">*/}
          {/*          <Label htmlFor="assetToken">*/}
          {/*            Asset Token*/}
          {/*          </Label>*/}
          {/*          <Select*/}
          {/*            onValueChange={field.onChange}*/}
          {/*            defaultValue={field.value}*/}
          {/*            disabled={isPending}*/}
          {/*          >*/}
          {/*            <SelectTrigger className={cn(*/}
          {/*              "h-12 bg-transparent text-lg",*/}
          {/*              errors.assetToken ? "border-destructive" : "border-input",*/}
          {/*              "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",*/}
          {/*            )}>*/}
          {/*              <SelectValue placeholder="Select asset token" />*/}
          {/*            </SelectTrigger>*/}
          {/*            <SelectContent>*/}
          {/*              {isPending ? (*/}
          {/*                <div className="flex items-center justify-center p-2">*/}
          {/*                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900"></div>*/}
          {/*                </div>*/}
          {/*              ) : assetTokenOptions && assetTokenOptions.length > 0 ? (*/}
          {/*                assetTokenOptions.map((token) => (*/}
          {/*                  <SelectItem key={`at-${token.name}-${token.symbol}`} value={`${token.symbol}-${token.address}`} className="h-12 text-lg">*/}
          {/*                    {token.address}*/}
          {/*                  </SelectItem>*/}
          {/*                ))*/}
          {/*              ) : (*/}
          {/*                <SelectItem value="" disabled>No asset tokens available</SelectItem>*/}
          {/*              )}*/}
          {/*            </SelectContent>*/}
          {/*          </Select>*/}
          {/*          <p className="text-destructive mt-2 text-sm">*/}
          {/*            {errors.assetToken?.message}*/}
          {/*          </p>*/}
          {/*        </div>*/}
          {/*      )}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="flex items-center justify-center col-span-3">
            <Button
              className="h-16 w-full max-w-80 rounded-lg py-8 text-lg font-bold [&_svg]:size-6"
              type="submit"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Rocket className="" />
              )}
              Launch
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default Launch
