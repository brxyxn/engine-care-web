import { RootState } from "@/redux/store"
import { selectRole, selectSession } from "@/redux/session/session-slice"
import { selectOwnerWorksAsMechanicSetting } from "@/redux/workspace/workspace-slice"

/**
 * Whether owners in this workspace can act as mechanics (be assigned work
 * orders, get the mechanic workbench). Individual/solo plans always can; team
 * and enterprise plans opt in via the workspace toggle.
 */
export const selectOwnersWorkAsMechanics = (state: RootState): boolean => {
  const plan = selectSession(state)?.shop.plan
  if (plan === "individual") return true
  return selectOwnerWorksAsMechanicSetting(state)
}

/** True when the current user is an owner who is acting as a mechanic. */
export const selectOwnerActsAsMechanic = (state: RootState): boolean =>
  selectRole(state) === "owner" && selectOwnersWorkAsMechanics(state)
