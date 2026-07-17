"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { workOrderStatusLabels } from "@/lib/format"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"
import { updateWorkOrder } from "@/redux/work-orders/work-orders-thunks"
import { ArrowLeft, ClipboardList, SendHorizontal } from "lucide-react"
import { toast } from "sonner"

const statusDot: Record<WorkOrderStatus, string> = {
  intake: "bg-muted-foreground",
  diagnostics: "bg-info",
  in_repair: "bg-chart-2",
  waiting_parts: "bg-warning",
  ready: "bg-success",
  delivered: "bg-muted-foreground",
}

export type WorkOrderNotesBoardProps = {
  workOrders: WorkOrder[]
  staff: StaffMember[]
}

export function WorkOrderNotesBoard({
  workOrders,
  staff,
}: WorkOrderNotesBoardProps) {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSession)
  const isMobile = useIsMobile()

  const openOrders = workOrders.filter((wo) => wo.status !== "delivered")
  const [selectedId, setSelectedId] = useState(openOrders[0]?.id ?? "")
  const [draft, setDraft] = useState("")
  // On mobile the list and conversation are separate views.
  const [showConversation, setShowConversation] = useState(false)

  const staffById = new Map(staff.map((s) => [s.id, s]))
  // Derive the active order so a stale id (e.g. an order just delivered) falls
  // back to the first open order without needing an effect.
  const selected =
    openOrders.find((wo) => wo.id === selectedId) ?? openOrders[0]

  const pick = (id: string) => {
    setSelectedId(id)
    setShowConversation(true)
  }

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

  const listHidden = isMobile && showConversation
  const conversationHidden = isMobile && !showConversation

  return (
    <Card className="flex h-[560px] flex-row gap-0 overflow-hidden p-0">
      {/* Work-order list */}
      <aside
        className={cn(
          "bg-card flex w-full flex-col border-r sm:w-72",
          listHidden && "hidden"
        )}
      >
        <div className="border-b px-4 py-3">
          <p className="font-semibold">Work Order Notes</p>
          <p className="text-muted-foreground text-xs">
            {openOrders.length} active {openOrders.length === 1 ? "order" : "orders"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {openOrders.length === 0 && (
            <p className="text-muted-foreground px-4 py-8 text-center text-sm">
              No active work orders.
            </p>
          )}
          {openOrders.map((wo) => {
            const last = wo.notes[wo.notes.length - 1]
            const active = selected?.id === wo.id
            return (
              <button
                key={wo.id}
                type="button"
                onClick={() => pick(wo.id)}
                className={cn(
                  "hover:bg-muted/60 flex w-full flex-col gap-1 border-b px-4 py-3 text-left transition-colors",
                  active && "bg-muted"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      statusDot[wo.status]
                    )}
                    aria-hidden
                  />
                  <span className="data-id text-muted-foreground">
                    {wo.number}
                  </span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {last ? format(new Date(last.at), "MMM d") : ""}
                  </span>
                </div>
                <p className="truncate text-sm font-medium">{wo.title}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {last
                    ? last.body
                    : `${workOrderStatusLabels[wo.status]} · no notes yet`}
                </p>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Conversation */}
      <section
        className={cn(
          "flex flex-1 flex-col",
          conversationHidden && "hidden"
        )}
      >
        {selected ? (
          <>
            <div className="flex items-center gap-2 border-b px-4 py-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="-ml-2 shrink-0"
                  aria-label="Back to work orders"
                  onClick={() => setShowConversation(false)}
                >
                  <ArrowLeft />
                </Button>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold">{selected.title}</p>
                <p className="text-muted-foreground text-xs">
                  <span className="data-id">{selected.number}</span> ·{" "}
                  {workOrderStatusLabels[selected.status]}
                </p>
              </div>
            </div>

            <div className="bg-muted/20 flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {selected.notes.length === 0 && (
                <p className="text-muted-foreground m-auto text-center text-sm">
                  No notes yet — capture findings as you work.
                </p>
              )}
              {selected.notes.map((note) => {
                const mine = note.authorId === session?.user.id
                return (
                  <div
                    key={note.id}
                    className={cn(
                      "flex max-w-[85%] flex-col gap-1",
                      mine && "self-end"
                    )}
                  >
                    <p
                      className={cn(
                        "text-muted-foreground text-xs",
                        mine && "text-right"
                      )}
                    >
                      {staffById.get(note.authorId)?.name ?? "Unknown"} ·{" "}
                      {format(new Date(note.at), "MMM d, h:mm a")}
                    </p>
                    <div
                      className={cn(
                        "rounded-xl px-3 py-2 text-sm",
                        mine
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border"
                      )}
                    >
                      {note.body}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-2 border-t p-3">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && addNote()}
                placeholder={`Add a note to ${selected.number}…`}
              />
              <Button
                size="icon"
                onClick={addNote}
                disabled={!draft.trim()}
                aria-label="Add note"
              >
                <SendHorizontal />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground m-auto flex flex-col items-center gap-2 text-sm">
            <ClipboardList className="size-6" />
            Select a work order to view its notes.
          </div>
        )}
      </section>
    </Card>
  )
}
