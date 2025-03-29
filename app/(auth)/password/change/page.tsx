"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { changePasswordAction } from "@/app/actions";

export default function ResetPasswordPage() {
  const changePasswordSchema = z
    .object({
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords must match",
      path: ["confirmPassword"],
    });

  type TChangePassword = z.infer<typeof changePasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TChangePassword>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit: SubmitHandler<TChangePassword> = async (
    data: TChangePassword
  ) => {
    changePasswordAction(data.password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Create a new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="newPassword">Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New Password"
                  {...register("password")}
                  required
                />
              </div>
              {errors.password && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.password.message}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmNewPassword">Confirm Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  {...register("confirmPassword")}
                  required
                />
              </div>
              {errors.confirmPassword && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.confirmPassword.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button className="w-full mt-4" type="submit">
              Confirm
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
