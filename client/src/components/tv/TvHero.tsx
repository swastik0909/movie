const TvHero = ({ tv }: { tv: any }) => {
  return (
    <div
      className="relative h-[70vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path})`,
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 h-full flex flex-col justify-end p-10 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">
          {tv.name}
        </h1>

        <p className="text-gray-300">
          {tv.first_air_date?.slice(0, 4)} • {tv.number_of_seasons} Seasons
        </p>
      </div>
    </div>
  );
};

export default TvHero;
