import React from 'react';
;
import { WalletConnection } from './app/wallet-connection';
import { GameHeader } from './app/header/header';
import { useGameLogic } from '~/hooks/use-game-logic';
import { GameContent } from './app/content/content';
import { GameFooter } from './app/footer/footer';

const FarquestGame: React.FC = () => {
  const {
    wallet,
    gameState,
    playerStats,
    connectWallet,
    disconnectWallet,
    startGame,
    handleAnswer,
    claimRewards,
    resetGame,
    currentQuestion
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-xl rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl">
        <GameHeader gameState={gameState.state} />

        <div className="p-4 border-b border-purple-500/20">
          <WalletConnection
            wallet={wallet}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>

        <GameContent
          gameState={gameState}
          playerStats={playerStats}
          currentQuestion={currentQuestion}
          wallet={wallet}
          onStartGame={startGame}
          onAnswerSelect={handleAnswer}
          onClaimRewards={claimRewards}
          onResetGame={resetGame}
        />

        <GameFooter />
      </div>
    </div>
  );
};

export default FarquestGame;
