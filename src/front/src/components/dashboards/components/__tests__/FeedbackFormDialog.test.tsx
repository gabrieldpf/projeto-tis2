import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import FeedbackFormDialog from '../FeedbackFormDialog';

vi.mock('../../../service/feedbackService', () => ({
  registrarFeedback: vi.fn(() => Promise.resolve({ data: {} })),
}));

describe('FeedbackFormDialog', () => {
  it('valida comentário com menos de 20 caracteres', async () => {
    const handleClose = vi.fn();
    render(<FeedbackFormDialog open={true} onClose={handleClose} projectId={1} />);

    const comentario = screen.getByLabelText(/Comentário/i);
    fireEvent.change(comentario, { target: { value: 'curto' } });

    const enviar = screen.getByText(/Enviar/i);
    fireEvent.click(enviar);

    expect(await screen.findByText(/Comentário deve ter ao menos 20 caracteres/i)).toBeDefined();
  });
});
