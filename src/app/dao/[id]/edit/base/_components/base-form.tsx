"use client"

import type { DaoDetailResult } from "~/server/service/dao"

interface BaseFormProps {
  dao: DaoDetailResult
}

const BaseForm = ({ dao }: BaseFormProps) => {
  return <div>
    test
  </div>
}

export default BaseForm