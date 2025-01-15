import { useState } from "react";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InstanceSelector } from "./message-composer/InstanceSelector";
import { AIContextInput } from "./message-composer/AIContextInput";
import { MessageInput } from "./message-composer/MessageInput";
import { useSelectedUser } from "./sidebar/SidebarContext";
import { useDispatchValidation } from "@/hooks/useDispatchValidation";
import { useDispatchCreation } from "@/hooks/useDispatchCreation";

interface MessageComposerProps {
  onSend: (message: string, instanceId: string, isAiDispatch: boolean, aiContext?: string) => Promise<string | undefined>;
  disabled?: boolean;
  contacts?: { name: string; phone: string }[];
}

export function MessageComposer({ onSend, disabled, contacts = [] }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  const [selectedInstance, setSelectedInstance] = useState<string>("");
  const [useAI, setUseAI] = useState(false);
  const { selectedUserId } = useSelectedUser();
  const { validationErrors, validateFields } = useDispatchValidation();
  const { createDispatch } = useDispatchCreation();

  const { data: profile } = useQuery({
    queryKey: ["profile", selectedUserId],
    queryFn: async () => {
      console.log("Fetching profile for user:", selectedUserId || "current user");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", selectedUserId || user.id)
        .single();

      console.log("Fetched profile:", profile);
      return profile;
    }
  });

  const handleSend = async () => {
    const isValid = validateFields({
      selectedInstance,
      message,
      useAI,
      context
    });

    if (isValid && profile) {
      const dispatchId = await createDispatch(
        profile,
        selectedInstance,
        message,
        useAI,
        context,
        contacts
      );

      if (dispatchId) {
        setMessage("");
        setContext("");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg space-y-4 border border-border">
        <InstanceSelector
          selectedInstance={selectedInstance}
          onInstanceSelect={setSelectedInstance}
          useAI={useAI}
          onAIToggle={setUseAI}
          webhookUrl={profile?.webhook_url}
        />
      </div>

      {useAI && (
        <div className="bg-card p-6 rounded-lg space-y-4 border border-border">
          <AIContextInput
            context={context}
            onContextChange={setContext}
          />
        </div>
      )}

      <div className="bg-card p-6 rounded-lg space-y-4 border border-border">
        <MessageInput
          message={message}
          onMessageChange={setMessage}
          isAI={useAI}
        />
      </div>

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
        onClick={handleSend}
        disabled={
          disabled || !message.trim() || !selectedInstance ||
          (useAI && !context.trim())
        }
      >
        <Send className="w-5 h-5 mr-2" />
        Disparar mensagens
      </Button>
    </div>
  );
}