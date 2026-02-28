import Swal from 'sweetalert2';

export const promptAuthRequired = async (navigate, t) => {
  const result = await Swal.fire({
    title: t ? t('authPrompt.title') : 'Accès requis',
    text: t ? t('authPrompt.text') : 'Vous devez créer un compte ou vous connecter pour utiliser ce service.',
    icon: 'warning',
    showDenyButton: true,
    confirmButtonText: t ? t('authPrompt.login') : 'Se connecter',
    denyButtonText: t ? t('authPrompt.register') : 'Créer un compte',
    denyButtonColor: '#16a34a',
    confirmButtonColor: '#facc15',
    background: '#ffffff',
    color: '#14532d',
  });

  if (result.isConfirmed) {
    navigate('/login');
    return;
  }

  if (result.isDenied) {
    navigate('/register');
  }
};
