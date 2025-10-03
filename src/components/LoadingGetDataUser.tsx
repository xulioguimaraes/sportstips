export const LoadingGetDataUser = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Carregando seu Perfil
        </h2>
        <p className="text-gray-600">
          Aguarde enquanto buscamos suas informações...
        </p>
      </div>
    </div>
  );
};
