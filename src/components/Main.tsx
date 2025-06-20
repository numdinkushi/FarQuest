import React from 'react';
import { WalletConnection } from './app/wallet-connection';
import { GameHeader } from './app/header/header';
import { GameContent } from './app/content/content';
import { GameFooter } from './app/footer/footer';
import { useGameLogic } from '~/hooks/use-game';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const FarquestGame: React.FC = () => {
  const {
    wallet,
    gameState,
    playerStats,
    isGameOver,
    isBonus,
    levelCompleted,
    currentDifficulty,
    questionInLevel,
    connectWallet,
    disconnectWallet,
    startGame,
    handleAnswer,
    claimRewards,
    resetGame,
    isConnectPending,
    currentQuestion,
    totalNumberOfQuestions,
    user,
    // Enhanced wallet features from updated useWallet
    isSDKLoaded,
    context,
    showSwitchNetworkBanner,
    isCorrectChain,
    switchToTargetChain,
    isSwitchChainPending,
    targetChain
  } = useGameLogic();

  // Show loading screen while SDK initializes (for Farcaster environment)
  if (!isSDKLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Home className="w-12 h-12 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4"
      style={{
        // Apply safe area insets from Farcaster context if available
        paddingTop: context?.client?.safeAreaInsets?.top ?? 16,
        paddingBottom: context?.client?.safeAreaInsets?.bottom ?? 16,
        paddingLeft: context?.client?.safeAreaInsets?.left ?? 16,
        paddingRight: context?.client?.safeAreaInsets?.right ?? 16,
      }}
    >
      <div className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-xl rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl">
        <GameHeader gameState={gameState.state} username={user?.username || ''} />

        <div className="p-4 border-b border-purple-500/20">
          <WalletConnection
            wallet={wallet}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            isConnectPending={isConnectPending}
            isSDKLoaded={isSDKLoaded}
            showSwitchNetworkBanner={showSwitchNetworkBanner}
            isCorrectChain={isCorrectChain}
            isSwitchChainPending={isSwitchChainPending}
            onSwitchChain={switchToTargetChain}
            targetChain={targetChain}
          />
        </div>

        <GameContent
          gameState={gameState}
          playerStats={playerStats}
          currentQuestion={currentQuestion}
          currentDifficulty={currentDifficulty}
          questionInLevel={questionInLevel}
          wallet={wallet}
          isBonus={isBonus}
          isGameOver={isGameOver}
          levelCompleted={levelCompleted}
          totalNumberOfQuestions={totalNumberOfQuestions}
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