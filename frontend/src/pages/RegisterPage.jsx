import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    const result = registerUser({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-[#166534]">Créer un compte utilisateur</h1>
      <p className="mt-2 text-sm text-gray-600">
        Créez votre compte pour accéder au service et envoyer vos demandes.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {error ? <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="sm:col-span-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p> : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Téléphone</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#16a34a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]"
          >
            Créer mon compte
          </button>
        </div>
      </form>

      <div className="mt-5">
        <Link
          to="/login"
          className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[#facc15] px-5 py-3 text-sm font-semibold text-[#166534] transition hover:bg-[#fef9c3]"
        >
          J’ai déjà un compte
        </Link>
      </div>
    </section>
  );
};

export default RegisterPage;
