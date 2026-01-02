export default function HeroSection() {
  return (
    <section
      className="hero bg-cover bg-center text-center py-20"
      style={{
        backgroundImage: `url('https://aliveinvite.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdWtoIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--960a39bec278bfff9d997a80f8e938f3578a5b7e/BG-FRONT.png')`,
      }}
    >
      <div className="wrapper text-[#62795A]">
        <p className="text-lg">Walimatul Urus</p>
      </div>

      <div className="wedding-couple text-[#745B37]">
        <p className="text-4xl font-bold">Faizal</p>
        <p className="text-2xl">&amp;</p>
        <p className="text-4xl font-bold">Adriana</p>
      </div>

      <p className="text-[#62795A] mt-4">
        <span className="block">Sunday, 31 December 2023</span>
        <span>Putrajaya Lakeview Suites, Presint 16 Putrajaya Malaysia</span>
      </p>
    </section>
  );
}
