import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createChannel } from "@/lib/actions/channel-actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Channel name is required").max(30, "Channel name cannot exceed 30 characters")
    .refine(name => /^[a-z0-9-_]+$/.test(name), {
      message: "Channel name can only contain lowercase letters, numbers, hyphens, and underscores",
    }),
  description: z.string().max(100, "Description cannot exceed 100 characters").optional(),
  isPrivate: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface ChannelFormProps {
  workspaceId: string;
  onSuccess?: () => void;
}

export function ChannelForm({ workspaceId, onSuccess }: ChannelFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const channelId = await createChannel({
        name: values.name,
        description: values.description || "",
        isPrivate: values.isPrivate,
        workspaceId,
      });
      
      router.refresh();
      
      if (onSuccess) {
        onSuccess();
      }
      
      router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
    } catch (error) {
      console.error("Failed to create channel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel Name</FormLabel>
              <FormControl>
                <Input placeholder="general" {...field} />
              </FormControl>
              <FormDescription>
                Lowercase letters, numbers, hyphens, and underscores only.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What is this channel about?" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Private Channel</FormLabel>
                <FormDescription>
                  Private channels are only visible to invited members
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Channel"}
        </Button>
      </form>
    </Form>
  );
} 