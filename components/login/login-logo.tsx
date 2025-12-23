import Image from "next/image"

export function LoginLogo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 p-8">
      <div className="flex flex-col items-center gap-4">

        {/* Local Logo */}
        <div className="relative h-128 w-128">
          <Image
            src="/Teslead-Connect-Logo.png"
            alt="Teslead Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wider text-white md:text-4xl">TESLEAD</h1>
          <p className="mt-2 text-sm text-slate-400">Delivery Challan Management</p>
        </div> */}
      </div>

      {/* <div className="mt-12 text-center">
        <p className="text-xs text-slate-500">Powered By</p>
        <p className="text-xs text-indigo-400">Teslead Equipments Private Limited</p>
      </div> */}
    </div>
  )
}
