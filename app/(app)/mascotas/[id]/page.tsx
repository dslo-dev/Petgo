import { PetDetailView } from '@/components/pets/pet-detail-view'

export default async function PetPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  return <PetDetailView id={id} />
}
