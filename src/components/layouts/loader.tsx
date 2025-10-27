import { Spinner } from "@/components/ui/spinner"

export default function Loader() {
  return (
    <div className={"w-[100vw] h-[100vh] flex items-center justify-center"}>
      <Spinner /> Loading
    </div>
  )
}
