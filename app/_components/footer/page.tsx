import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mail } from "lucide-react";
import { ArrowRight } from "lucide-react";

import {
  faFacebook,
  faInstagram,
  faTiktok,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
function Footer() {
  return (
    <div className="bg-[#E0DED4] p-12">
      <div className="flex flex-col gap-6 md:flex-row md:gap-3 md:items-center md:justify-between ">
        <div className="flex gap-5 text-[#2D4735] items-center ">
          <h3 className="text-xl">V E L A</h3>{" "}
          <p className="text-sm">Go Things InSide</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:flex md:gap-4">
          <Link
            href={"/"}
            className="flex items-center gap-1.5 text-[#2D4735] text-lg"
          >
            Facebook
            <FontAwesomeIcon
              icon={faFacebook}
              className="text-blue-600 text-2xl"
            ></FontAwesomeIcon>
          </Link>
          <Link
            href={"/"}
            className="flex items-center gap-1.5 text-[#2D4735] text-lg"
          >
            Instagram{" "}
            <FontAwesomeIcon
              icon={faInstagram}
              className="text-orange-600 text-2xl "
            ></FontAwesomeIcon>
          </Link>
          <Link
            href={"/"}
            className="flex items-center gap-1.5 text-[#2D4735] text-lg"
          >
            TikTok
            <FontAwesomeIcon
              icon={faTiktok}
              className="text-black text-2xl"
            ></FontAwesomeIcon>
          </Link>
        </div>
      </div>
      <hr className="mt-5 text- text-[#2D4735]" />
      <div>
        <h1 className="text-center py-2.5 text-xl text-[#2D4735]">
          Created By eng:Ahmed Ali
        </h1>
        <div className="grid grid-cols-2 gap-4 w-[90%] mx-auto md:flex md:gap-4 md:justify-between md:items-center">
          <h3 className="col-span-2 flex gap-2 text-xl text-[#2D4735] items-center md:col-auto">
            Contact me with
            <ArrowRight />
          </h3>

          <Link
            href={"/"}
            target="blank"
            className="flex items-center gap-1.5 text-lg text-[#2D4735]"
          >
            {" "}
            Whatsapp
            <FontAwesomeIcon
              className="text-green-500 text-2xl"
              icon={faWhatsapp}
            ></FontAwesomeIcon>
          </Link>
          <Link
            href={"/"}
            target="blank"
            className="flex items-center gap-1.5 text-lg text-[#2D4735]"
          >
            {" "}
            FaceBook
            <FontAwesomeIcon
              className="text-blue-600 text-2xl"
              icon={faFacebook}
            ></FontAwesomeIcon>
          </Link>
          <Link
            href={"/"}
            target="blank"
            className="flex items-center gap-1.5 text-lg text-[#2D4735]"
          >
            {" "}
            Instagram
            <FontAwesomeIcon
              className="text-orange-600 text-2xl"
              icon={faInstagram}
            ></FontAwesomeIcon>
          </Link>
          <Link
            href={"/"}
            target="blank"
            className="flex items-center gap-1.5 text-lg text-[#2D4735]"
          >
            {" "}
            Mail
            <Mail />
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Footer;
