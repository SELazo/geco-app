// DEPRECATED: Este archivo ha sido reemplazado por el flujo de 3 pasos
// Redirige automáticamente al nuevo flujo
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const GEditGroupFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Redirigir al nuevo flujo de 3 pasos
      navigate(`/contacts/groups/edit-group/${id}`, { replace: true });
    } else {
      // Si no hay ID, regresar a la lista de grupos
      navigate('/contacts/groups', { replace: true });
    }
  }, [id, navigate]);

  return null; // No renderizar nada, solo redirigir
};
