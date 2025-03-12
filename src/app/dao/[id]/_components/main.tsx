import { SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import CardWrapper from "~/components/card-wrapper"
import { Input } from "~/components/ui/input"
import ContributorCard from "~/app/dashboard/_components/contributor-card"

const DaoContent = () => {
  return (
    <div className={"my-10 grid w-full grid-cols-1 gap-8 md:grid-cols-3"}>
      <div className={"col-span-1 flex flex-col gap-4 md:col-span-2"}>
        <CardWrapper contentClassName={"bg-card"}>
          <div
            className={"flex flex-row justify-between bg-black/50 px-12 py-3"}
          >
            <div className={"max-w-max text-center"}>
              <div className={"text-sm font-thin"}>Market Cap</div>
              <div className={"mt-2 text-xl"}>9.13k</div>
            </div>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Created By</div>
              <div className={"mt-2 text-xl"}>0x2eFd...7dCF</div>
            </div>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Token Address</div>
              <div className={"mt-2 text-xl"}>0x2eFd...7dCF</div>
            </div>
          </div>
          <div className={"bg-secondary flex flex-row gap-4 px-12 py-3"}>
            <div>Capabilities</div>
            <SiTelegram />
            <SiX />
          </div>
        </CardWrapper>
        <img src={"http://downloads.echocow.cn/K.png"} alt={"K"} />
        <CardWrapper contentClassName={"bg-card"}>
          <div className={"flex w-full flex-col gap-4 px-10 py-5"}>
            <div className={"text-2xl font-bold"}>Message Board</div>
            <div
              className={"mt-4 flex flex-col gap-4 rounded-lg bg-[#22272B] p-2"}
            >
              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-lg"}>
                  0x2eFD...2343
                  <span className={"ml-6 text-sm text-gray-400"}>
                    2024-12-17 23:32:34
                  </span>
                </div>
                <div className={"text-sm"}>Reply</div>
              </div>
              <div className={"text-gray-400"}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                sed ultrices urna. Sed interdum felis ac lectus tristique, eget
                ullamcorper lectus tincidunt.
              </div>
            </div>
            <div
              className={"mt-4 flex flex-col gap-4 rounded-lg bg-[#22272B] p-2"}
            >
              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-lg"}>
                  0x2eFD...2343
                  <span className={"ml-6 text-sm text-gray-400"}>
                    2024-12-17 23:32:34
                  </span>
                </div>
                <div className={"text-sm"}>Reply</div>
              </div>
              <div className={"text-gray-400"}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                sed ultrices urna. Sed interdum felis ac lectus tristique, eget
                ullamcorper lectus tincidunt.
              </div>
            </div>
            <div
              className={"mt-4 flex flex-col gap-4 rounded-lg bg-[#22272B] p-2"}
            >
              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-lg"}>
                  0x2eFD...2343
                  <span className={"ml-6 text-sm text-gray-400"}>
                    2024-12-17 23:32:34
                  </span>
                </div>
                <div className={"text-sm"}>Reply</div>
              </div>
              <div className={"text-gray-400"}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                sed ultrices urna. Sed interdum felis ac lectus tristique, eget
                ullamcorper lectus tincidunt.
              </div>
            </div>
            <div
              className={"mt-4 flex flex-col gap-4 rounded-lg bg-[#22272B] p-2"}
            >
              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-lg"}>
                  0x2eFD...2343
                  <span className={"ml-6 text-sm text-gray-400"}>
                    2024-12-17 23:32:34
                  </span>
                </div>
                <div className={"text-sm"}>Reply</div>
              </div>
              <div className={"text-gray-400"}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                sed ultrices urna. Sed interdum felis ac lectus tristique, eget
                ullamcorper lectus tincidunt.
              </div>
            </div>
            <div
              className={"mt-4 flex flex-col gap-4 rounded-lg bg-[#22272B] p-2"}
            >
              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-lg"}>
                  0x2eFD...2343
                  <span className={"ml-6 text-sm text-gray-400"}>
                    2024-12-17 23:32:34
                  </span>
                </div>
                <div className={"text-sm"}>Reply</div>
              </div>
              <div className={"text-gray-400"}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                sed ultrices urna. Sed interdum felis ac lectus tristique, eget
                ullamcorper lectus tincidunt.
              </div>
            </div>
          </div>
        </CardWrapper>
      </div>
      <div className={"col-span-1 flex flex-col gap-4"}>
        <CardWrapper contentClassName={"bg-card"}>
          <div className={"bg-black/50 px-5 py-6"}>
            <div className={"w-full px-6"}>
              <CardWrapper className={"w-full"} contentClassName={"bg-card"}>
                <div
                  className={
                    "text-md flex w-full flex-row items-center justify-around"
                  }
                >
                  <div
                    className={
                      "bg-secondary w-full flex-1 cursor-pointer rounded-lg py-2 text-center"
                    }
                  >
                    Buy
                  </div>
                  <div
                    className={
                      "w-full flex-1 cursor-pointer rounded-lg py-2 text-center"
                    }
                  >
                    Sell
                  </div>
                </div>
              </CardWrapper>
            </div>
            <div className={"mt-10 flex flex-row justify-between"}>
              <div className={"text-gray-500"}>Balance 11,323.23 AGENT</div>
              <div className={"font-thin"}>MAX</div>
            </div>
            <Input className={"h-14"} />
            <div className={"mt-4 grid grid-cols-3 gap-4"}>
              <div className={"bg-[#22272B] py-1 text-center font-thin"}>
                10
              </div>
              <div className={"bg-[#22272B] py-1 text-center font-thin"}>
                100
              </div>
              <div className={"bg-[#22272B] py-1 text-center font-thin"}>
                1000
              </div>
            </div>
            <div className={"mt-4 text-gray-600"}>
              You will receive{" "}
              <span className={"text-white"}>2.343 $FORTUNA</span>
            </div>
            <div className={"mt-8 text-gray-600"}>Trading Fee</div>
            <div
              className={
                "bg-secondary mt-8 w-full rounded-4xl py-4 text-center"
              }
            >
              Place Trade
            </div>
          </div>
        </CardWrapper>
        <ContributorCard />
        <CardWrapper contentClassName={"bg-card"}>
          <div className={"mb-1 rounded-lg bg-black/60 p-4"}>
            <div className={"text-2xl font-medium"}>Token Distribution</div>
            <div className={"mt-3 flex flex-col gap-2"}>
              {Array.from({ length: 11 }, (_, i) => i).map((item, index) => (
                <div
                  key={`Contributor-${item}`}
                  className={"flex flex-row items-center gap-2 font-thin"}
                >
                  <div className={"w-6"}>{index}.</div>
                  <div className={"flex-1 truncate"}>0x5e6F...39dC</div>
                  <div>3.54%</div>
                </div>
              ))}
            </div>
          </div>
        </CardWrapper>
      </div>
    </div>
  )
}

export default DaoContent
