import Image, {ImageProps} from "next/image";

import caprover from "./caprover.png";

export function CapRover({ className = 'inline-block size-5 align-sub object-contain', ...props }: Partial<ImageProps>) {
    return (
        <Image
            src={caprover}
            alt="CapRover"
            width={24}
            height={24}
            className={className}
            {...props}
        />
    );
}
