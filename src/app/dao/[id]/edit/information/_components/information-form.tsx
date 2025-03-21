"use client"

import type { DaoDetailResult } from "~/server/service/dao"

interface BaseFormProps {
  dao: DaoDetailResult
}

const InformationForm = ({ dao }: BaseFormProps) => {
  return <div>
    test
  </div>
}

export default InformationForm