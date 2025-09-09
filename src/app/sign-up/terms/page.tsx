'use client'

import { POLICY } from '@/shares/constant/sigin-up-privacy'
import { ChevronRight } from 'lucide-react'
import Button from '@/shares/common-components/button'
import { useState } from 'react'
import { useModalStore } from '@/shares/stores/modal-store'
import { useRouter } from 'next/navigation'

const TermsScreen = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const { openModal } = useModalStore()
  const router = useRouter()

  const handleCheckboxChange = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleAllCheck = () => {
    const allChecked = POLICY.every(policy => checkedItems[policy.id])
    if (allChecked) {
      setCheckedItems({})
    } else {
      const newCheckedItems: Record<string, boolean> = {}
      POLICY.forEach(policy => {
        newCheckedItems[policy.id] = true
      })
      setCheckedItems(newCheckedItems)
    }
  }

  const showTermsModal = (policyId: string) => {
    const policy = POLICY.find(p => p.id === policyId)
    if (policy) {
      openModal({
        title: policy.title,
        content: policy.content,
        isMarkdown: true,
        showCancelButton: false,
        confirmText: '확인',
      })
    }
  }

  const isAllRequiredChecked = POLICY.filter(p => p.required).every(p => checkedItems[p.id])
  const isAllChecked = POLICY.every(p => checkedItems[p.id])

  const handleNextClick = () => {
    if (isAllRequiredChecked) {
      router.push('/sign-up/phone-check')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-144px)]">
      <div className="px-[20px] pt-[16px] pb-[16px]">
        <h1 className="text-title-1">
          서비스 이용을 위해 <br />약관에 동의해주세요.
        </h1>
      </div>

      <div className="px-[20px] flex-1 ">
        <button className="flex justify-between" onClick={handleAllCheck}>
          <div className="flex items-center gap-[16px] select-none">
            <input
              type="checkbox"
              className="checkbox-all"
              checked={isAllChecked}
            />
            <h4 className="text-title-4">전체 동의하기</h4>
          </div>
        </button>
        <div className="h-[1px] bg-grey05 my-[16px]"/>

        <div className="flex flex-col space-y-4">
          {POLICY.map(policy => (
            <div key={policy.id} className="flex justify-between">
              <label className="flex cursor-pointer items-center gap-[16px] select-none">
                <input
                  type="checkbox"
                  className="checkbox-base"
                  checked={checkedItems[policy.id] || false}
                  onChange={() => handleCheckboxChange(policy.id)}
                />
                <span>
                [{policy.required ? '필수' : '선택'}] {policy.title}
                </span>
              </label>

              <button 
                type="button" 
                className="cursor-pointer p-1"
                onClick={() => showTermsModal(policy.id)}
              >
                <ChevronRight color="var(--color-black)" size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-[20px]">
        <Button
          variant="default"
          disabled={!isAllRequiredChecked}
          onClick={handleNextClick}
        >
          다음
        </Button>
      </div>
    </div>
  )
}

export default TermsScreen
