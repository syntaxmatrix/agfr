import { GalleryVerticalEnd} from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { ProductName } from "@/constant"

export default function LoginPage() {
  return (
    <div className="auth-wrapper p-4">
      <div className="auth-card">
        <div className="flex justify-center gap-2 mb-6">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {ProductName}.
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
