import { Outlet } from '@tanstack/react-router'

/** Pass-through layout for intermediate routes that only nest children. */
export function OutletLayout() {
  return <Outlet />
}
