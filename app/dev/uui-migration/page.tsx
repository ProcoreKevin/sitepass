import { notFound, redirect } from "next/navigation"

export default function UuiMigrationRedirectPage() {
  if (process.env.NODE_ENV !== "development") notFound()
  redirect("/dev/uui-studio/migration")
}
