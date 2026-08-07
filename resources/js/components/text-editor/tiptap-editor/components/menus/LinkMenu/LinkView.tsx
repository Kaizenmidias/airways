import useCopyToClipboard from '../../../hooks/useCopyToClipboard';
import MenuButton from '../../MenuButton';
import { Toolbar } from '../../ui/Toolbar';

interface LinkViewProps {
   url: string;
   onEdit?: () => void;
   onRemove?: () => void;
}

const LinkView = ({ url, onEdit, onRemove }: LinkViewProps) => {
   const { copy, isCopied } = useCopyToClipboard();

   return (
      <Toolbar>
         <MenuButton text="Editar link" hideText={false} onClick={onEdit} />
         <MenuButton icon="ExternalLink" text="Abrir em nova aba" onClick={() => window.open(url, '_blank')} />
         <MenuButton icon={isCopied ? 'Check' : 'Clipboard'} text={isCopied ? 'Copiado' : 'Copiar link'} onClick={() => copy(url)} />
         <MenuButton icon="Unlink" text="Remover link" onClick={onRemove} />
      </Toolbar>
   );
};

export default LinkView;
