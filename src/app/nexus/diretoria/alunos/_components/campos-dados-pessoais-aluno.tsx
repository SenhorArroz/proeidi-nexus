"use client";
import { User } from "lucide-react";
import type { ModalCadastroAlunoProps } from "./modal-cadastro-aluno";
import { formatarCpf, type SimNao } from "./suporte";

type CamposDadosPessoaisAlunoProps = {
	form: ModalCadastroAlunoProps["form"];
	setForm: ModalCadastroAlunoProps["setForm"];
};
export function CamposDadosPessoaisAluno({
	form,
	setForm,
}: CamposDadosPessoaisAlunoProps) {
	return (
		<div className="view-campos-dados-pessoais-aluno space-y-4">
			<h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
				<User className="w-5 h-5 text-gray-400" /> Dados Gerais
			</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="space-y-1 lg:col-span-2">
					<label className="text-sm font-semibold text-gray-700">
						Nome Completo
					</label>
					<input
						required
						type="text"
						value={form.nome}
						onChange={(e) => setForm({ ...form, nome: e.target.value })}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					/>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Data de Nascimento
					</label>
					<input
						required
						type="date"
						value={form.dataNascimento}
						onChange={(e) =>
							setForm({ ...form, dataNascimento: e.target.value })
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					/>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">CPF</label>
					<input
						required
						type="text"
						value={form.cpf}
						onChange={(e) =>
							setForm({ ...form, cpf: formatarCpf(e.target.value) })
						}
						placeholder="000.000.000-00"
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					/>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Cor ou Raça
					</label>
					<select
						required
						value={form.corRaca}
						onChange={(e) => setForm({ ...form, corRaca: e.target.value })}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Branca">Branca</option>
						<option value="Preta">Preta</option>
						<option value="Amarela">Amarela</option>
						<option value="Parda">Parda</option>
						<option value="Indígena">Indígena</option>
					</select>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Identidade de Gênero
					</label>
					<select
						required
						value={form.identidadeGenero}
						onChange={(e) =>
							setForm({ ...form, identidadeGenero: e.target.value })
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Homem cis">Homem cis</option>
						<option value="Mulher cis">Mulher cis</option>
						<option value="Homem trans">Homem trans</option>
						<option value="Mulher trans">Mulher trans</option>
						<option value="Não binário">Não binário</option>
						<option value="Outra">Outra</option>
						<option value="Não informar">Não informar</option>
					</select>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Pessoa LGBTQIAPN+?
					</label>
					<select
						required
						value={form.lgbtqiapn}
						onChange={(e) => setForm({ ...form, lgbtqiapn: e.target.value })}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sim">Sim</option>
						<option value="Não">Não</option>
						<option value="Prefiro não informar">Prefiro não informar</option>
					</select>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Telefone Pessoal
					</label>
					<input
						required
						type="text"
						value={form.telefone}
						onChange={(e) => setForm({ ...form, telefone: e.target.value })}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					/>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Contato de Emergência
					</label>
					<input
						required
						type="text"
						value={form.contatoEmergencia}
						onChange={(e) =>
							setForm({ ...form, contatoEmergencia: e.target.value })
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					/>
				</div>
				<div className="space-y-1 lg:col-span-2">
					<label className="text-sm font-semibold text-gray-700">
						Email{" "}
						<span className="text-xs font-normal text-gray-400">
							(opcional)
						</span>
					</label>
					<input
						type="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						placeholder="exemplo@email.com"
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					/>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Responsável cuidado terceiros?
					</label>
					<select
						required
						value={form.cuidaTerceiros}
						onChange={(e) =>
							setForm({
								...form,
								cuidaTerceiros: e.target.value as SimNao,
							})
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sim">Sim</option>
						<option value="Não">Não</option>
					</select>
				</div>
			</div>
		</div>
	);
}
