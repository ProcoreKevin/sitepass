"use client"

import { CommitmentDetailContent } from "@/components/commitment-detail-content"

// Mock data for commitments - in a real app, this would come from a database
const commitmentsData: Record<string, any> = {
  "SC-001-007": {
    number: "SC-001-007",
    title: "Flooring Specialists",
    status: "Out For Signature",
    contractCompany: "Flooring Specialists",
    generalInfo: {
      title: "Flooring",
      executed: "Yes",
      defaultRange: "5%",
      attachments: "09 Finishes - level 2 wood",
      description:
        'It is understood that the following is included in this subcontract. This list is not intended to be inclusive of all work required by the Contract Documents and does not relieve the subcontractor to include all required materials equipment and labor to provide a complete and operable system or systems. It shall be the Subcontractors responsibility to coordinate his work so that it interfaces properly with other trades. It is further understood that time is of the essence and that all efforts will be made to guarantee installations of materials furnished as a part of this contract and as required by the attached construction schedule (Exhibit "C"). If there are any special or unusual lead time requirements that will affect the completion of the work, this office shall be notified within Twenty four hours (24) from receipt of this contract.',
    },
  },
  "SC-001-001": {
    number: "SC-001-001",
    title: "PD Excavation",
    status: "Approved",
    contractCompany: "PD Excavation",
    generalInfo: {
      title: "Earth Work & Landscaping",
      executed: "Yes",
      defaultRange: "3%",
      attachments: "02 Site Work - Excavation",
      description:
        "This subcontract includes all earthwork, excavation, grading, and landscaping work as specified in the contract documents. The subcontractor shall coordinate with all other trades and ensure proper site preparation and drainage.",
    },
  },
  "SC-001-002": {
    number: "SC-001-002",
    title: "Smooth Concrete",
    status: "Approved",
    contractCompany: "Smooth Concrete",
    generalInfo: {
      title: "Concrete & Masonry",
      executed: "Yes",
      defaultRange: "4%",
      attachments: "03 Concrete - Structural",
      description:
        "This subcontract includes all concrete and masonry work including foundations, slabs, walls, and structural elements as specified in the contract documents.",
    },
  },
}

export default async function CommitmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const commitment = commitmentsData[id] || commitmentsData["SC-001-007"] // Fallback to SC-001-007

  return <CommitmentDetailContent commitment={commitment} />
}
