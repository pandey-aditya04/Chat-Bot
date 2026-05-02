import { useParams } from 'react-router-dom';
import ChatWidget from '../../components/chatbot/ChatWidget';

const BotEmbedView = () => {
  const { botId } = useParams();

  return (
    <div className="fixed inset-0 bg-transparent flex flex-col overflow-hidden">
      <ChatWidget 
        botId={botId} 
        inline 
        className="flex-1 !max-w-none !h-full rounded-none border-none shadow-none" 
      />
    </div>
  );
};

export default BotEmbedView;
