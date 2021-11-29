import {  useEffect, useState } from 'react';
import './App.css';
import { BehaviorSubject } from 'rxjs';

interface ModalContexts {
  'welcome': { };

  'confirmation': {
    bodyText: string;
    confirmationCTA: string;
  };
}

const ModalSubject = new BehaviorSubject({ id: '' } as any);

const ModalManager = {
  open: <T extends keyof ModalContexts>({ id, ...context } : { id: T } & ModalContexts[T]) => {
    ModalSubject.next({ id, ...context });
  },
  subscribe: ModalSubject.subscribe,
}

const useModal = <T extends keyof ModalContexts>(id: T) : [boolean, ModalContexts[T]] => {
  const [modalContext, setModalContext] = useState<any>({ isOpen: false, context: {} });

  useEffect(() => {
    ModalSubject.subscribe(({ id: openedModalId, ...context }) => {
      setModalContext({
        isOpen: openedModalId === id,
        context,
      });
    });
  }, [id]);

  return [modalContext.isOpen, modalContext.context];
}

const WelcomeModal = () => {
  const [isOpen] = useModal('welcome');

  return isOpen
    ? <div>Welcome!</div>
    : null;
};

const ConfirmationModal = () => {
  const [isOpen, { bodyText, confirmationCTA }] = useModal('confirmation');

  return isOpen
    ? (
      <div>
        <h1>Confirma</h1>
        <p>{ bodyText }</p>
        <button>{ confirmationCTA }</button>
      </div>
      )
    : null;
};

function App() {
  return (
    <main>
      <button
        onClick={ () => {
          ModalManager.open({ id: 'welcome' });
        } }
      >
        Abrir modal sem contexto
      </button>
      <button
        onClick={ () => {
          // ModalManager.open({ id: 'confirmation', bodyText: 'Deseja fazer isso mesmo?', confirmationCTA: 'Sim' });
          ModalManager.open({ id: 'confirmation', bodyText: 'tamo nois', confirmationCTA: 'eh isso' });
        } }
      >
        Abrir modal com contexto
      </button>

      <WelcomeModal />
      <ConfirmationModal />
    </main>
  );
}

export default App;
