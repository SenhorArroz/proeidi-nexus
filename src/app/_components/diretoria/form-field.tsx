type DiretoriaFormFieldProps = { label: string; value: string; onChange: (value: string) => void; type?: string; };

export function DiretoriaFormField({ label, value, onChange, type = "text" }: DiretoriaFormFieldProps) {
	return <label className="block"><span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-sky-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 transition focus:border-sky-500 focus:bg-white" /></label>;
}
