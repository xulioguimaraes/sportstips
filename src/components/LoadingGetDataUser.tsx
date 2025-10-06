export const LoadingGetDataUser = ({ message }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#a3bd04] mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {message || "Carregando seu Perfil"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Aguarde enquanto buscamos suas informações...
        </p>
      </div>
    </div>
  );
};
