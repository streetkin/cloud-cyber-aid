import { useRef, useState } from "react";
import { CheckCircle2, FileText, Trash2, UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "./Field";
import { cn } from "@/lib/utils";
import { DOCUMENTS, type DocumentKey, type StoredFile, type VoucherState } from "@/lib/voucher/model";

const MAX_BYTES = 10 * 1024 * 1024;

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${Math.ceil(bytes / 1024)} KB`;

type Props = {
  state: VoucherState;
  onFile: (key: DocumentKey, file: StoredFile | null) => void;
};

function DropZone({
  docKey,
  label,
  required,
  stored,
  onFile,
}: {
  docKey: DocumentKey;
  label: string;
  required: boolean;
  stored: StoredFile | undefined;
  onFile: (key: DocumentKey, file: StoredFile | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Formato non ammesso: caricare esclusivamente file in formato PDF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File troppo pesante: il limite è di 10 MB per documento.");
      return;
    }
    setError(null);
    onFile(docKey, {
      name: file.name,
      size: file.size,
      type: file.type || "application/pdf",
      uploadedAt: new Date().toISOString(),
    });
  };

  return (
    <Card className={cn("overflow-hidden", stored && "border-success/40")}>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium leading-relaxed text-foreground">{label}</p>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              required ? "bg-danger-soft text-danger" : "bg-muted text-muted-foreground",
            )}
          >
            {required ? "Obbligatorio" : "Opzionale"}
          </span>
        </div>

        {stored ? (
          <div className="flex items-center justify-between gap-3 rounded-md border border-success/40 bg-success-soft px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-success" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{stored.name}</p>
                <p className="text-[11px] text-success">
                  {formatSize(stored.size)} · caricamento completato
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Rimuovi documento"
              onClick={() => onFile(docKey, null)}
            >
              <Trash2 className="size-4 text-danger" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              accept(event.dataTransfer.files[0]);
            }}
            className={cn(
              "flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-md border border-dashed px-4 py-6 text-center transition-colors",
              dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            )}
          >
            <UploadCloud className="size-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Trascina qui il PDF o clicca per selezionarlo
            </span>
            <span className="text-[11px] text-muted-foreground">Solo PDF · massimo 10 MB</span>
          </button>
        )}

        {error ? <p className="text-xs font-medium text-danger">{error}</p> : null}

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(event) => accept(event.target.files?.[0])}
        />
      </CardContent>
    </Card>
  );
}

export function Step4Documenti({ state, onFile }: Props) {
  const missing = DOCUMENTS.filter((doc) => doc.required && !state.documenti[doc.key]);

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Step 4 di 5">Caricamento documenti del fascicolo</SectionTitle>
      <p className="max-w-3xl text-sm text-muted-foreground">
        I documenti restano sul tuo dispositivo: qui vengono registrati nome, dimensione e stato per
        comporre la checklist del fascicolo da allegare sul portale Invitalia.
      </p>

      {missing.length > 0 ? (
        <div className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning-soft p-4">
          <FileText className="mt-0.5 size-5 shrink-0 text-warning-foreground" />
          <p className="text-sm font-medium text-warning-foreground">
            Mancano ancora {missing.length} documenti obbligatori per completare il fascicolo.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {DOCUMENTS.map((doc) => (
          <DropZone
            key={doc.key}
            docKey={doc.key}
            label={doc.label}
            required={doc.required}
            stored={state.documenti[doc.key]}
            onFile={onFile}
          />
        ))}
      </div>
    </div>
  );
}
