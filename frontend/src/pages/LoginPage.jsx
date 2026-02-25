import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    const result = loginUser(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/request-worker');
  };

  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-[#166534]">Connexion utilisateur</h1>
      <p className="mt-2 text-sm text-gray-600">
        Connectez-vous pour publier et gérer vos demandes de travailleurs.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="vous@exemple.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#16a34a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]"
        >
          Se connecter
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-3">
        <Link
          to="/register"
          className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[#facc15] px-5 py-3 text-sm font-semibold text-[#166534] transition hover:bg-[#fef9c3]"
        >
          Créer un compte
        </Link>
      </div>
    </section>
  );
};

export default LoginPage;
