import Swal from 'sweetalert2';

export const promptAuthRequired = async (navigate) => {
  const result = await Swal.fire({
    title: 'Accès requis',
    text: 'Vous devez créer un compte ou vous connecter pour utiliser ce service.',
    icon: 'warning',
    showDenyButton: true,
    confirmButtonText: 'Se connecter',
    denyButtonText: 'Créer un compte',
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
