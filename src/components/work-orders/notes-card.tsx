"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"
import { updateWorkOrder } from "@/redux/work-orders/work-orders-thunks"
import { SendHorizontal } from "lucide-react"
import { toast } from "sonner"

export type NotesCardProps = {
  workOrders: WorkOrder[]
  staff: StaffMember[]
}

export function NotesCard({ workOrders, staff }: NotesCardProps) {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSession)

  const openOrders = workOrders.filter((wo) => wo.status !== "delivered")
  const [selectedId, setSelectedId] = useState(openOrders[0]?.id ?? "")
  const [draft, setDraft] = useState("")

  const staffById = new Map(staff.map((s) => [s.id, s]))
  const selected =
    openOrders.find((wo) => wo.id === selectedId) ?? openOrders[0]

  const addNote = async () => {
    if (!selected || !draft.trim()) return
    const note: WorkOrderNote = {
      // Deterministic id keeps the compiler-checked closure pure; the real
      // backend owns note ids
      id: `won_${selected.id}_${selected.notes.length + 1}`,
      authorId: session?.user.id ?? "unknown",
      body: draft.trim(),
      at: new Date().toISOString(),
    }
    await dispatch(
      updateWorkOrder({
        id: selected.id,
        patch: { notes: [...selected.notes, note] },
      })
    )
    setDraft("")
    toast.success(`Note added to ${selected.number}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Order Notes</CardTitle>
        {openOrders.length > 0 && (
          <CardAction>
            <Select value={selected?.id ?? ""} onValueChange={setSelectedId}>
              <SelectTrigger size="sm" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {openOrders.map((wo) => (
                  <SelectItem key={wo.id} value={wo.id}>
                    {wo.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex max-h-52 flex-col gap-2 overflow-y-auto">
          {(selected?.notes ?? []).length === 0 && (
            <p className="text-muted-foreground py-6 text-center text-sm">
              No notes yet — capture findings as you work.
            </p>
          )}
          {selected?.notes.map((note) => (
            <div key={note.id} className="bg-muted/40 rounded-xl p-3">
              <p className="text-muted-foreground mb-1 text-xs">
                {staffById.get(note.authorId)?.name ?? "Unknown"} ·{" "}
                {format(new Date(note.at), "MMM d, h:mm a")}
              </p>
              <p className="text-sm">{note.body}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addNote()}
            placeholder="Add a quick note…"
          />
          <Button
            size="icon"
            onClick={addNote}
            disabled={!draft.trim() || !selected}
            aria-label="Add note"
          >
            <SendHorizontal />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
