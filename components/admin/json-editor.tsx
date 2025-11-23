"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface JsonEditorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
    rows?: number;
}

export function JsonEditor({ value, onChange, error, label = "JSON Data", rows = 10 }: JsonEditorProps) {
    const [jsonError, setJsonError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Validate JSON on change
        if (newValue.trim()) {
            try {
                JSON.parse(newValue);
                setJsonError(null);
            } catch (err) {
                setJsonError("Invalid JSON format");
            }
        } else {
            setJsonError(null);
        }
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(value);
            const formatted = JSON.stringify(parsed, null, 2);
            onChange(formatted);
            setJsonError(null);
        } catch (err) {
            setJsonError("Cannot format invalid JSON");
        }
    };

    const displayError = error || jsonError;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="json-editor">{label}</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={formatJson}
                    disabled={!value || !!jsonError}
                >
                    Format JSON
                </Button>
            </div>
            <Textarea
                id="json-editor"
                value={value}
                onChange={handleChange}
                rows={rows}
                className={`font-mono text-sm ${displayError ? "border-destructive" : ""}`}
                placeholder='{"key": "value"}'
            />
            {displayError && (
                <p className="text-sm text-destructive">{displayError}</p>
            )}
            <p className="text-xs text-muted-foreground">
                Enter valid JSON data. Use the Format button to auto-format your JSON.
            </p>
        </div>
    );
}
