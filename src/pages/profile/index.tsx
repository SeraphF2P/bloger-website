import { Container } from "@/ui";
import type { NextPage } from "next";
import Image from "next/image";

const Index: NextPage = () => {
  return (
    <Container>
      <section className=" pb-[51px] ">
        <div className=" relative h-40 w-full bg-primary">
          <div className=" absolute -bottom-1/3 left-1/2 h-36 w-36 -translate-x-1/2 overflow-hidden rounded-full ">
            <Image fill src="/male-avatar.webp" alt={`profile picture`} />
          </div>
        </div>
      </section>
    </Container>
  );
};

export default Index;
