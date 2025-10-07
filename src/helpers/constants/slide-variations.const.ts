interface IVariation {
  name: string;
  preview: string;
  mobile: string;
}

const imagePlaceholder = `<svg width="20" height="20" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.98519 22.1642L5.50177 29.5024C5.09465 30.1688 5.57422 31.0238 6.3551 31.0238H32.6083C33.3659 31.0238 33.8483 30.2141 33.4877 29.5478L25.6836 15.1284C25.3877 14.5818 24.6193 14.5397 24.2655 15.0507L16.0017 26.9872C15.5902 27.5816 14.7033 27.5564 14.3263 26.9396L11.4073 22.1641C11.0823 21.6324 10.3101 21.6325 9.98519 22.1642Z" fill="icon-color"/>
<ellipse cx="13.8588" cy="14.2532" rx="3.71429" ry="3.79747" fill="icon-color"/>
</svg>
`;

const chartPlaceholder = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2295 3.5C10.2295 3.22386 10.0053 2.99814 9.7299 3.01785C8.52131 3.10432 7.35272 3.50337 6.3405 4.17971C5.18936 4.94888 4.29215 6.04213 3.76234 7.32122C3.23252 8.6003 3.0939 10.0078 3.364 11.3656C3.63409 12.7235 4.30078 13.9708 5.27974 14.9497C6.25871 15.9287 7.50599 16.5954 8.86386 16.8655C10.2217 17.1356 11.6292 16.997 12.9083 16.4672C14.1874 15.9373 15.2806 15.0401 16.0498 13.889C16.7261 12.8768 17.1252 11.7082 17.2116 10.4996C17.2314 10.2242 17.0056 10 16.7295 10H10.7295C10.4534 10 10.2295 9.77614 10.2295 9.5V3.5Z" fill="icon-color"/>
<path d="M17.8477 9C18.1238 9 18.3495 8.77586 18.3298 8.50042C18.2763 7.75217 18.1027 7.01627 17.8148 6.32122C17.463 5.47194 16.9474 4.70026 16.2974 4.05025C15.6474 3.40024 14.8757 2.88463 14.0264 2.53284C13.3314 2.24494 12.5955 2.07139 11.8472 2.01785C11.5718 1.99814 11.3477 2.22386 11.3477 2.5L11.3477 8.5C11.3477 8.77614 11.5715 9 11.8477 9H17.8477Z" fill="icon-color"/>
</svg>
`;

const moveIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-icon lucide-move"><path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg>`;
const handIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-icon lucide-hand"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>`;

//refabrished
const listVariations: IVariation[] = [
  {
    name: 'twoCol',
    mobile: 'Bullet list with heading',
    preview: `<div className="size-full aspect-video bg-[bg-color] rounded-lg p-[6%]">
                <div className="bg-[text-color] rounded-full w-10/12 h-[13%] mb-[3%]"></div>
                <div className="bg-[text-color] rounded-full w-7/12 h-[7%] mb-[5%]"></div>
                <div className="grid grid-cols-2 w-full h-[45%] gap-y-[40%]">
                  <div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2 mb-[4%]"></div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2"></div>
                  </div>
                  <div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2 mb-[4%]"></div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2"></div>
                  </div>
                  <div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2 mb-[4%]"></div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2"></div>
                  </div>
                  <div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2 mb-[4%]"></div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2"></div>
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'twoCol-without-subtitle',
    mobile: 'Bullet list with heading',
    preview: `<div className="size-full aspect-video bg-[bg-color] rounded-lg p-[6%]">
                <div className="bg-[text-color] rounded-full w-10/12 h-[13%] mb-[6%]"></div>
                <div className="grid grid-cols-2 w-full h-[45%] gap-y-[40%]">
                  <div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2 mb-[4%]"></div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2"></div>
                  </div>
                  <div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2 mb-[4%]"></div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2"></div>
                  </div>
                  <div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2 mb-[4%]"></div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2"></div>
                  </div>
                  <div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2 mb-[4%]"></div>
                    <div className="bg-[text-color] rounded-full w-10/12 h-1/2"></div>
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'list',
    mobile: 'Bullet list',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-lg p-[6%]">
                <div className="bg-[text-color] rounded-full w-10/12 h-[13%] mb-[7%]"></div>
                <div className="h-2/3 flex flex-col">
                  <div className="flex w-10/12 gap-[3%] mb-[2%] h-[10%]">
                    <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                    <div className="bg-[text-color] h-full w-full rounded-full"></div>
                  </div>
                  <div className="flex w-10/12 gap-[3%] mb-[2%] h-[10%]">
                    <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                    <div className="bg-[text-color] h-full w-full rounded-full"></div>
                  </div>
                  <div className="flex w-10/12 gap-[3%] h-[10%]">
                    <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                    <div className="bg-[text-color] h-full w-full rounded-full"></div>
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'cardLike',
    mobile: 'Card like',
    preview: `<div className="size-full aspect-video bg-[bg-color] rounded-lg p-[6%]">
                <div className="bg-[text-color] rounded-full w-10/12 h-[13%] mb-[3%]"></div>
                <div className="bg-[text-color] rounded-full w-7/12 h-[7%] mb-[5%]"></div>
                <div className="grid grid-cols-3 w-full h-[75%] gap-[5%]">
                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'cardLike-without-subtitle',
    mobile: 'Card like',
    preview: `<div className="size-full aspect-video bg-[bg-color] rounded-lg p-[6%]">
                <div className="bg-[text-color] rounded-full w-10/12 h-[13%] mb-[7%]"></div>
                <div className="grid grid-cols-3 w-full h-[75%] gap-[5%]">
                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>

                  <div className="mb-[11%] bg-[image-color] rounded p-[11%] flex flex-col gap-[20%] items-end">
                    <div className="flex w-full gap-[5%] h-full">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="bg-[text-color] rounded-full w-[80%] h-full"></div>
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'top-with-cards',
    mobile: 'Card like',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-col-reverse p-[6%]">
                <div className="h-2/3 w-full pt-[5%]">               
                    <div className="bg-[text-color] h-[22%] w-10/12 rounded-full"></div>
                    <div className="grid grid-cols-3 pt-[6%] gap-x-[10%] gap-y-[20%] h-[50%]">   
                      <div className="flex w-full gap-[3%]">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%]">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%]">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%]">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%]">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%]">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-1/3 w-full rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'right-1/2-list',
    mobile: 'Bullet list',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="w-1/2 aspect-video bg-[bg-color] rounded-[4px] rounded-lg">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[13%]"></div>
                  <div className="h-2/3 flex flex-col gap-[5%]">
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-1/2 rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'left-1/2-list',
    mobile: 'Bullet list',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row gap-[5%] p-[6%]">
                <div className="w-1/2 aspect-video bg-[bg-color] rounded-[4px] rounded-lg">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[13%]"></div>
                  <div className="h-2/3 flex flex-col gap-[5%]">
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-1/2 rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'right-1/3-list',
    mobile: 'Bullet list',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="w-[60%] aspect-video bg-[bg-color] rounded-[4px] rounded-lg">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-7/12 h-[7%] mb-[5%]"></div>
                  <div className="h-2/3 flex flex-col gap-[5%]">
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'right-1/3-list-without-subtitle',
    mobile: 'Bullet list',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="w-[60%] aspect-video bg-[bg-color] rounded-[4px] rounded-lg">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[13%]"></div>
                  <div className="h-2/3 flex flex-col gap-[5%]">
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'left-1/3-list',
    mobile: 'Bullet list',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row gap-[5%] p-[6%]">
                <div className="w-[60%] aspect-video bg-[bg-color] rounded-[4px] rounded-lg">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-7/12 h-[7%] mb-[5%]"></div>
                  <div className="h-2/3 flex flex-col gap-[5%]">
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'left-1/3-list-without-subtitle',
    mobile: 'Bullet list',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row gap-[5%] p-[6%]">
                <div className="w-[60%] aspect-video bg-[bg-color] rounded-[4px] rounded-lg">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[13%]"></div>
                  <div className="h-2/3 flex flex-col gap-[5%]">
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                    <div className="flex w-full gap-[3%] h-[10%]">
                      <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                      <div className="bg-[text-color] h-full w-full rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'left-1/3-cards',
    mobile: 'Card like',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-7/12 h-[7%] mb-[5%]"></div>
                  <div className="grid grid-rows-2 w-full h-[65%] gap-[10%]">
                    <div className="bg-[image-color] rounded p-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>

                    <div className="bg-[image-color] rounded p-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'left-1/3-cards-without-subtitle',
    mobile: 'Card like',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="grid grid-rows-2 w-full h-[65%] gap-[10%]">
                    <div className="bg-[image-color] rounded p-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>

                    <div className="bg-[image-color] rounded p-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'right-1/3-cards',
    mobile: 'Card like',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-7/12 h-[7%] mb-[5%]"></div>
                  <div className="grid grid-rows-2 w-full h-[65%] gap-[10%]">
                    <div className="bg-[image-color] rounded p-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>

                    <div className="bg-[image-color] rounded p-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'right-1/3-cards-without-subtitle',
    mobile: 'Card like',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="grid grid-rows-2 w-full h-[65%] gap-[10%]">
                    <div className="bg-[image-color] rounded p-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>

                    <div className="bg-[image-color] rounded p-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'left-1/3-cards-cols',
    mobile: 'Card like',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                    <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                    <div className="grid grid-cols-2 w-full h-[65%] gap-y-[10%] gap-x-[7%]">
                      <div className="bg-[image-color] rounded p-[13%] flex flex-col gap-[18%] items-end">
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>

                      <div className="bg-[image-color] rounded p-[13%] flex flex-col gap-[18%] items-end">
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>

                      <div className="bg-[image-color] rounded p-[13%] flex flex-col gap-[18%] items-end">
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>

                      <div className="bg-[image-color] rounded p-[13%] flex flex-col gap-[18%] items-end">
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'right-1/3-cards-cols',
    mobile: 'Card like',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                    <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                    <div className="grid grid-cols-2 w-full h-[65%] gap-y-[10%] gap-x-[7%]">
                      <div className="bg-[image-color] rounded p-[13%] flex flex-col gap-[18%] items-end">
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>

                      <div className="bg-[image-color] rounded p-[13%] flex flex-col gap-[18%] items-end">
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>

                      <div className="bg-[image-color] rounded p-[13%] flex flex-col gap-[18%] items-end">
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>

                      <div className="bg-[image-color] rounded p-[13%] flex flex-col gap-[18%] items-end">
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'left-1/3-numbered',
    mobile: 'Bullet list with heading',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-7/12 h-[7%] mb-[5%]"></div>
                  <div className="grid grid-rows-2 w-full h-[59%]">
                    <div className="rounded py-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>

                    <div className="rounded py-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'left-1/3-numbered-without-subtitle',
    mobile: 'Bullet list with heading',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="grid grid-rows-2 w-full h-[59%]">
                    <div className="rounded py-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>

                    <div className="rounded py-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'right-1/3-numbered',
    mobile: 'Bullet list with heading',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-7/12 h-[7%] mb-[5%]"></div>
                  <div className="grid grid-rows-2 w-full h-[59%]">
                    <div className="rounded py-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>

                    <div className="rounded py-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'right-1/3-numbered-without-subtitle',
    mobile: 'Bullet list with heading',
    preview: `<div className="w-full h-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-[60%] flex flex-col">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="grid grid-rows-2 w-full h-[59%]">
                    <div className="rounded py-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>

                    <div className="rounded py-[6%] flex flex-col gap-[5%] items-end">
                      <div className="flex w-full gap-[3%] mb-[2%] h-full">
                        <div className="aspect-square bg-[text-color] h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex w-full gap-[3%] h-full">
                        <div className="aspect-square h-full rounded-full"></div>
                        <div className="bg-[text-color] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">${imagePlaceholder}</div>
              </div>`,
  },
  {
    name: 'top-with-shapes',
    mobile: 'With shapes',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-col-reverse p-[6%]">
                <div className="h-2/3 w-full flex flex-col pt-[4%]">      
                  <div className="w-7/12 h-[30%] bg-[text-color] rounded-full"></div>       
                  <div className="flex gap-[5%] w-full h-full pt-[4%]">
                    <div className="flex flex-col gap-[8%] h-full w-full">
                      <div className="bg-[image-color] h-[82%] rounded-md flex items-center justify-center">
                        <div className="bg-[text-color] aspect-square h-[30%] rounded-full mb-[12%]"></div>
                      </div>
                      <div className="bg-[text-color] h-[18%] rounded-full"></div>
                    </div>
                    <div className="flex flex-col gap-[8%] h-full w-full">
                      <div className="bg-[image-color] h-[82%] rounded-md flex items-center justify-center">
                        <div className="bg-[text-color] aspect-square h-[30%] rounded-full mb-[12%]"></div>
                      </div>
                      <div className="bg-[text-color] h-[18%] rounded-full"></div>
                    </div>
                    <div className="flex flex-col gap-[8%] h-full w-full">
                      <div className="bg-[image-color] h-[82%] rounded-md flex items-center justify-center">
                        <div className="bg-[text-color] aspect-square h-[30%] rounded-full mb-[12%]"></div>
                      </div>
                      <div className="bg-[text-color] h-[18%] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-1/3 w-full rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
];

//refabrished
const shapeSlideVariations: IVariation[] = [
  {
    name: 'default',
    mobile: 'Arrow shapes',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%]">
                <div className="h-[13%] bg-[text-color] rounded-full w-9/12"></div>
                <div className="grid grid-cols-3 w-full h-[46%] gap-x-[5%] gap-y-[14%] mt-[7%]">
                  <div className="bg-[image-color] size-full rounded-full p-[11%]">
                    <div className="bg-[text-color] size-full rounded-full"></div>
                  </div>
                  <div className="bg-[image-color] size-full rounded-full p-[11%]">
                    <div className="bg-[text-color] size-full rounded-full"></div>
                  </div>
                  <div className="bg-[image-color] size-full rounded-full p-[11%]">
                    <div className="bg-[text-color] size-full rounded-full"></div>
                  </div>
                  <div className="bg-[image-color] size-full rounded-full p-[11%]">
                    <div className="bg-[text-color] size-full rounded-full"></div>
                  </div>
                  <div className="bg-[image-color] size-full rounded-full p-[11%]">
                    <div className="bg-[text-color] size-full rounded-full"></div>
                  </div>
                  <div className="bg-[image-color] size-full rounded-full p-[11%]">
                    <div className="bg-[text-color] size-full rounded-full"></div>
                  </div>
                </div>
              </div>`,
  },
];

//reafbrished
const cardVariations: IVariation[] = [
  {
    name: '16/9',
    mobile: 'Card with 16:9 aspect ratio image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex flex-col justify-center">
    <div className="bg-[text-color] rounded-full h-[13%] w-2/3 mb-[6%] text-center mx-auto"></div>
    <div className="flex gap-2 justify-center items-center">
      <div className="w-1/3 h-full">
        <div className="bg-[image-color] rounded-[4px] w-full aspect-video mb-[12%] flex items-center justify-center">
          ${imagePlaceholder}
        </div>
        <div className="bg-[text-color] rounded-full h-[17%] w-full"></div>
      </div>
      <div className="w-1/3 h-full">
        <div className="bg-[image-color] rounded-[4px] w-full aspect-video mb-[12%] flex items-center justify-center">
          ${imagePlaceholder}
        </div>
        <div className="bg-[text-color] rounded-full h-[17%] w-full"></div>
      </div>
      <div className="w-1/3 h-full">
        <div className="bg-[image-color] rounded-[4px] w-full aspect-video mb-[12%] flex items-center justify-center">
          ${imagePlaceholder}
        </div>
        <div className="bg-[text-color] rounded-full h-[17%] w-full"></div>
      </div>
    </div>
  </div>`,
  },
  {
    name: '3/2',
    mobile: 'Card with 3:2 aspect ratio image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex flex-col justify-center">
    <div className="bg-[text-color] rounded-full h-[13%] w-2/3 mb-[6%] text-center mx-auto"></div>
    <div className="flex gap-2 justify-center items-center">
      <div className="w-1/3 h-full">
        <div className="bg-[image-color] rounded-[4px] w-full aspect-3/2 mb-[12%] flex items-center justify-center">
          ${imagePlaceholder}
        </div>
        <div className="bg-[text-color] rounded-full h-[15%] w-full"></div>
      </div>
      <div className="w-1/3 h-full">
        <div className="bg-[image-color] rounded-[4px] w-full aspect-3/2 mb-[12%] flex items-center justify-center">
          ${imagePlaceholder}
        </div>
        <div className="bg-[text-color] rounded-full h-[15%] w-full"></div>
      </div>
      <div className="w-1/3 h-full">
        <div className="bg-[image-color] rounded-[4px] w-full aspect-3/2 mb-[12%] flex items-center justify-center">
          ${imagePlaceholder}
        </div>
        <div className="bg-[text-color] rounded-full h-[15%] w-full"></div>
      </div>
    </div>
  </div>`,
  },
  {
    name: 'full',
    mobile: 'Full size cards',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex gap-[3%] justify-center items-center">
      <div className="w-1/3 h-full relative">
        <div className="bg-[image-color] rounded-[4px] w-full h-full mb flex items-center justify-center">
          ${imagePlaceholder}
        </div>
        <div className="bg-[text-color] rounded-[4px] w-9/12 h-[7%] absolute bottom-[5%] left-[6%]"></div>
      </div>
      <div className="w-1/3 h-full relative">
        <div className="bg-[image-color] rounded-[4px] w-full h-full mb flex items-center justify-center">
          ${imagePlaceholder}
        </div>
        <div className="bg-[text-color] rounded-[4px] w-9/12 h-[7%] absolute bottom-[5%] left-[6%]"></div>
      </div>
      <div className="w-1/3 h-full relative">
        <div className="bg-[image-color] rounded-[4px] w-full h-full mb flex items-center justify-center">
          ${imagePlaceholder}
        </div>
        <div className="bg-[text-color] rounded-[4px] w-9/12 h-[7%] absolute bottom-[5%] left-[6%]"></div>
      </div>
  </div>`,
  },
];

//refacbirshed
const imageSlideVariations: IVariation[] = [
  {
    name: 'default',
    mobile: 'Images layout',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded rounded-lg p-[6%] flex flex-col justify-center">
    <div className="flex gap-[5%] justify-center items-center mb-[5%] h-1/3">
      <div className="w-1/4 h-full">
        <div className="bg-[image-color] rounded w-full h-full flex items-center justify-center">
           ${imagePlaceholder}
        </div>
      </div>
      <div className="w-1/4 h-full">
        <div className="bg-[image-color] rounded w-full h-full flex items-center justify-center">
          ${imagePlaceholder}
        </div>
      </div>
      <div className="w-1/4 h-full">
        <div className="bg-[image-color] rounded w-full h-full flex items-center justify-center">
          ${imagePlaceholder}
        </div>
      </div>
      <div className="w-1/4 h-full">
        <div className="bg-[image-color] rounded w-full h-full flex items-center justify-center">
          ${imagePlaceholder}
        </div>
      </div>
    </div>
    <div className="flex gap-[5%] justify-center items-center h-1/2">      
      <div className="w-1/2 h-full">
        <div className="bg-[image-color] rounded w-full h-full flex items-center justify-center">
          ${imagePlaceholder}
        </div>
      </div>
      <div className="w-1/2 h-full">
        <div className="bg-[image-color] rounded w-full h-full flex items-center justify-center">
          ${imagePlaceholder}
        </div>
      </div>
    </div>
  </div>`,
  },
];

//refabrished
const titleSlideVariations: IVariation[] = [
  {
    name: 'center',
    mobile: 'Central text with background',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[5%] flex flex-col justify-center items-center relative">
                <div className="bg-[bg-color] rounded-full h-[11%] w-2/3 mb-[3%]"></div>
                <div className="bg-[bg-color] rounded-full h-[11%] w-2/3"></div>
              </div>`,
  },
  {
    name: 'bottom',
    mobile: 'Side text with background',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[6%] flex flex-col justify-end relative">
        <div className="bg-[bg-color] rounded-full h-[11%] w-2/3 mb-[3%]"></div>
        <div className="bg-[bg-color] rounded-full h-[11%] w-2/3"></div>
      </div>`,
  },
  {
    name: 'bottomWithout',
    mobile: '2/3 bottom image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex justify-between gap-[6%]">
                <div className="flex flex-col justify-end w-[60%]">
                  <div className="bg-[text-color] rounded-full h-[11%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full h-[11%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] w-[40%] h-full flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'bottomRightWithout',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex flex-row-reverse justify-between gap-[6%]">
                <div className="flex flex-col justify-end w-[60%]">
                  <div className="bg-[text-color] rounded-full h-[11%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full h-[11%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] w-[40%] h-full flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
  name: 'businessSubtitleLeft',
  mobile: '2/3 top image',
  preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[6%] flex justify-between gap-[6%]">
              <div className="flex flex-col justify-center w-[60%] mt-[10%]">
                <div className="bg-[bg-color] rounded-full h-[11%] mb-[3%] w-[90%]"></div>
                <div className="bg-[bg-color] rounded-full h-[11%] mb-[8%] w-[90%]"></div>
                <div className="bg-[bg-color] rounded-full h-[5%] my-[4%] w-[15%]"></div>
                <div className="bg-[bg-color] rounded-full h-[7%] mt-[3%] w-1/2"></div>
                <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%]"></div>
                <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%]"></div>
              </div>
            </div>`,
  },
  {
    name: 'businessLeft',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[6%] flex justify-between gap-[6%]">
                <div className="flex flex-col justify-center w-[60%] mt-[10%]">
                  <div className="bg-[bg-color] rounded-full h-[11%] mb-[3%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[11%] mb-[8%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] my-[4%] w-[15%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%]"></div>
                </div>
              </div>`,
  },
  {
    name: 'businessSubtitleCenter',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[6%] flex justify-center gap-[6%]">
                <div className="flex flex-col justify-center items-center w-[60%] mt-[10%]">
                  <div className="bg-[bg-color] rounded-full h-[11%] mb-[3%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[11%] mb-[8%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] my-[4%] w-[15%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[9%] mt-[3%] w-1/2"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%] w-full"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%] w-full"></div>
                </div>
              </div>`,
  },
  {
    name: 'businessCenter',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[6%] flex justify-center gap-[6%]">
                <div className="flex flex-col justify-center items-center w-[60%] mt-[10%]">
                  <div className="bg-[bg-color] rounded-full h-[11%] mb-[3%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[11%] mb-[8%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%] w-full"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%] w-full"></div>
                </div>
              </div>`,
  },
  {
    name: 'businessLeftBoldWithout',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[6%] flex justify-between gap-[6%]">
                <div className="flex flex-col justify-center w-[60%] mt-[10%]">
                  <div className="bg-[bg-color] rounded-full h-[11%] mb-[3%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[11%] mb-[30%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%]"></div>
                </div>
              </div>`,
  },
  {
    name: 'businessLeftWithout',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[6%] flex justify-between gap-[6%]">
                <div className="flex flex-col justify-center w-[60%] mt-[10%]">
                  <div className="bg-[bg-color] rounded-full h-[8%] mb-[3%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[8%] mb-[30%] w-[90%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%]"></div>
                  <div className="bg-[bg-color] rounded-full h-[5%] mt-[3%]"></div>
                </div>
              </div>`,
  },
  {
    name: 'businessDiagonalBoldWithout',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[6%] flex justify-between gap-[6%]">
                 <div className="flex flex-col w-[50%]">
                    <div className="bg-[bg-color] rounded-full h-[8%] mb-[3%] w-[90%]"></div>
                    <div className="bg-[bg-color] rounded-full h-[8%] mb-[30%] w-[90%]"></div>
                  </div>
                  <div className="flex-col rounded-[4px] w-[50%] h-full flex items-center justify-end">
                    <div className="bg-[bg-color] rounded-full w-full h-[5%] mt-[3%]"></div>
                    <div className="bg-[bg-color] rounded-full w-full h-[5%] mt-[3%]"></div>
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'businessDiagonalWithout',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[6%] flex justify-between gap-[6%]">
                 <div className="flex flex-col w-[50%]">
                    <div className="bg-[bg-color] rounded-full h-[6%] mb-[3%] w-[90%]"></div>
                    <div className="bg-[bg-color] rounded-full h-[6%] mb-[30%] w-[90%]"></div>
                  </div>
                  <div className="flex-col rounded-[4px] w-[50%] h-full flex items-center justify-end">
                    <div className="bg-[bg-color] rounded-full w-full h-[5%] mt-[3%]"></div>
                    <div className="bg-[bg-color] rounded-full w-full h-[5%] mt-[3%]"></div>
                  </div>
                </div>
              </div>`,
  },
];

//refabrished
const sideBarVariations: IVariation[] = [
  {
    name: 'right',
    mobile: 'Bottom image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex gap-[5%] p-[6%]">
                <div className="h-full w-1/2">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-1/2 rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'left',
    mobile: 'Top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-1/2">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-1/2 rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'top',
    mobile: '2/3 Bottom image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-col-reverse p-[6%]">
                <div className="h-1/2 w-full flex gap-[5%] pt-[5%]">                  
                  <div className="bg-[text-color] rounded-full w-1/2 h-[22%]"></div>
                  <div className='h-full w-1/2'>
                    <div className="bg-[text-color] rounded-full w-full h-[15%] mb-[5%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[16%] mb-[5%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[16%] mb-[5%]"></div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-1/2 w-full rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'bottom',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-col p-[6%]">
                <div className="h-1/2 w-full flex gap-[5%]">                  
                  <div className="bg-[text-color] rounded-full w-1/2 h-[20%]"></div>
                  <div className='h-full w-1/2'>
                    <div className="bg-[text-color] rounded-full w-full h-[15%] mb-[5%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[15%] mb-[5%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[15%] mb-[5%]"></div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-1/2 w-full rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'right-1/3',
    mobile: '1/3 Bottom image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex gap-[5%] p-[6%]">
                <div className="h-full w-[60%]">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'left-1/3',
    mobile: '1/3 top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-[60%]">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'right-1/3-bolder',
    mobile: '1/3 top image with bolder text',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex gap-[5%] p-[6%]">
                <div className="h-full w-[60%]">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[8%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[8%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'left-1/3-bolder',
    mobile: '1/3 bottom image with bolder text',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-[60%]">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[8%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[8%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'right-1/3-withoutHeading',
    mobile: '1/3 top image without heading',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex gap-[5%] p-[6%]">
                <div className="h-full w-[60%]">
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'left-1/3-withoutHeading',
    mobile: '1/3 bottom image without heading',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-[60%]">
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[40%] rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
];

//refabrished
const twoTextColVariations: IVariation[] = [
  {
    name: 'long-text',
    mobile: 'Long text',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex flex-col justify-start items-start h-full">
                <div className="bg-[text-color] rounded-full w-10/12 h-[13%] mb-[6%]"></div>
                <div className="bg-[text-color] rounded-full w-10/12 h-[7%] mb-[2%]"></div>
                <div className="bg-[text-color] rounded-full w-10/12 h-[7%] mb-[2%]"></div>
                <div className="bg-[text-color] rounded-full w-10/12 h-[7%]"></div>
             </div>`,
  },
  {
    name: 'short-text',
    mobile: 'Short bold text',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex flex-col justify-start items-start">
              <div className="bg-[text-color] rounded-full w-10/12 h-[13%] mb-[2%]"></div>
              <div className="bg-[text-color] rounded-full w-10/12 h-[13%]"></div>
            </div>`,
  },
  {
    name: 'side-text',
    mobile: 'Normal text',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex flex-row justify-start items-start gap-[5%]">
              <div className="w-1/2 h-full">
                <div className="bg-[text-color] rounded-full w-12/12 h-[13%]"></div>
              </div>
              <div className="w-1/2 h-full">
                <div className="bg-[text-color] rounded-full h-[7%] mb-[4%]"></div>
                <div className="bg-[text-color] rounded-full h-[7%] mb-[4%]"></div>
                <div className="bg-[text-color] rounded-full h-[7%]"></div>
              </div>
            </div>`,
  },
  {
    name: 'two-col-text',
    mobile: 'Normal text with less space',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex flex-row justify-start items-start gap-[5%]">
                <div className="w-1/2 h-full">
                  <div className="bg-[text-color] rounded-full w-12/12 h-[13%] mb-[7%]"></div>
                  <div className="bg-[text-color] rounded-full w-12/12 h-[7%] mb-[4%]"></div>
                  <div className="bg-[text-color] rounded-full w-12/12 h-[7%] mb-[4%]"></div>
                  <div className="bg-[text-color] rounded-full w-12/12 h-[7%] mb-[4%]"></div>
                </div>
                <div className="w-1/2 h-full">
                  <div className="rounded-full w-10/12 h-[13%] mb-[7%]"></div>
                  <div className="bg-[text-color] rounded-full w-12/12 h-[7%] mb-[4%]"></div>
                  <div className="bg-[text-color] rounded-full w-12/12 h-[7%] mb-[4%]"></div>
                  <div className="bg-[text-color] rounded-full w-12/12 h-[7%] mb-[4%]"></div>
                </div>
            </div>`,
  },
];

//refabrished
const importantTextVariations: IVariation[] = [
  {
    name: 'central',
    mobile: 'Central text',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex flex-col justify-center items-center">
                <div className="bg-[text-color] rounded-full h-[7%] w-1/3 mb-[4%]"></div>
                <div className="bg-[text-color] rounded-full h-[12%] w-2/3 mb-[3%]"></div>
                <div className="bg-[text-color] rounded-full h-[12%] w-2/3"></div>
              </div>`,
  },
  {
    name: 'left',
    mobile: 'Left text',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[6%] flex flex-col justify-start items-start">
                <div className="bg-[text-color] rounded-full h-[7%] w-1/3 mb-[4%]"></div>
                <div className="bg-[text-color] rounded-full h-[12%] w-2/3 mb-[3%]"></div>
                <div className="bg-[text-color] rounded-full h-[12%] w-2/3"></div>
              </div>`,
  },
];

//refabrished
const sectionHeadlineSlideVariations: IVariation[] = [
  {
    name: 'center',
    mobile: 'Central text',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[5%] flex flex-col justify-center items-center relative">
                <div className="bg-[bg-color] rounded-full h-[13%] w-1/2"></div>
              </div>`,
  },
  {
    name: 'left-without',
    mobile: 'Left without background',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[5%] flex flex-col justify-center relative">
        <div className="bg-[text-color] rounded-full h-[13%] w-1/2"></div>
      </div>`,
  },
  {
    name: 'left',
    mobile: 'Left text',
    preview: `<div className="w-full aspect-video bg-[image-color] rounded-[4px] rounded-lg p-[5%] flex flex-col justify-center relative">
        <div className="bg-[bg-color] rounded-full h-[13%] w-1/2"></div>
      </div>`,
  },
  {
    name: 'center-without',
    mobile: 'Central text',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg p-[5%] flex flex-col justify-center items-center relative">
                <div className="bg-[text-color] rounded-full h-[13%] w-1/2"></div>
              </div>`,
  },
];

//refabrished
const chartVariations: IVariation[] = [
  {
    name: 'single-chart',
    mobile: 'Top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex justify-center p-[6%] gap-[6%]">
                <div className="bg-[image-color] rounded-[4px] h-full w-[60%] rounded-lg flex items-center justify-center">
                  ${chartPlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'leftWithText',
    mobile: 'Top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse p-[6%] gap-[6%]">
                <div className="h-full w-[40%]">
                  <div className="bg-[text-color] rounded-full w-full h-[12%] mb-[10%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[7%] mb-[5%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[7%] mb-[5%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[60%] rounded-lg flex items-center justify-center">
                  ${chartPlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'rightWithText',
    mobile: 'Top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex p-[6%] gap-[6%]">
                <div className="h-full w-[40%]">
                  <div className="bg-[text-color] rounded-full w-full h-[12%] mb-[10%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[7%] mb-[5%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[7%] mb-[5%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-[60%] rounded-lg flex items-center justify-center">
                  ${chartPlaceholder}
                </div>
              </div>`,
  },
];

const contentsVariations: IVariation[] = [
  {
    name: 'default',
    mobile: 'Text content',
    preview: `<div className="w-full aspect-video bg-[text-color] rounded-[4px] rounded-lg p-2 flex flex-col justify-center items-center relative">
                <div className="bg-[bg-color] rounded-[4px] h-[8px] w-2/3 mb-[3px]"></div>
                <div className="bg-[bg-color] rounded-[4px] h-[8px] w-2/4 mb-[3px]"></div>
              </div>`,
  },
];

const tableSlideVariations: IVariation[] = [
  {
    name: 'default',
    mobile: 'Table layout',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-lg p-[6%] flex flex-col">
                <div className="bg-[text-color] rounded-full w-10/12 h-[13%] mb-[6%]"></div>
                <div className="grid grid-cols-2 w-full h-[1/2]">
                  <div></div>
                  <div className="border border-[#D1D5DB] rounded-tr-sm bg-[image-color] flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                  <div className="border border-[#D1D5DB] bg-[image-color] flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                  <div className="border border-[#D1D5DB] flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                  <div className="border border-[#D1D5DB] rounded-bl-sm bg-[image-color] flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                  <div className="border border-[#D1D5DB] rounded-br-sm flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'columnHeaderWithout',
    mobile: 'Table layout',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-lg p-[6%] flex flex-col">
                <div className="bg-[text-color] rounded-full w-10/12 h-[13%] mb-[6%]"></div>
                <div className="grid grid-cols-2 w-full h-[1/2]">
                  <div className="border border-[#D1D5DB] rounded-tl-sm bg-[image-color] flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                  <div className="border border-[#D1D5DB] rounded-tr-sm bg-[image-color] flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                  <div className="border border-[#D1D5DB] flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                  <div className="border border-[#D1D5DB] flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                  <div className="border border-[#D1D5DB] rounded-bl-sm flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                  <div className="border border-[#D1D5DB] rounded-br-sm flex items-center justify-center">
                    <div className="bg-[text-color] rounded-full w-full h-[20%] m-[10%]"></div>
                  </div>
                </div>
              </div>`,
  },
];

const freeSlideVariations: IVariation[] = [
  {
    name: 'default',
    mobile: 'Free-slide layout',
    preview: `<div className="w-full aspect-video bg-[bg-color] justify-center items-center rounded-lg flex gap-[5%] p-[6%]">
      <div className="relative h-full w-1/2 flex items-center justify-center rounded-lg text-gray-500 bg-[image-color]">
        <div className="text-[80px]">
          ${handIcon}
        </div>
        <div className="absolute bottom-6 right-6 ">
          ${moveIcon}
        </div>
      </div>
    </div>`,
  },
];

const screenSlideVariations: IVariation[] = [
  {
    name: 'right',
    mobile: 'Bottom image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-lg p-[6%] flex flex-col">
                <div className="bg-[text-color] rounded-full w-1/2 h-[10%] mb-[6%]"></div>
                <div className="flex gap-[5%] flex-1">
                  <div className="w-1/2 flex flex-col ">
                    <div className="bg-[text-color] rounded-full w-full h-[8%] my-[3%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[8%] mb-[3%]"></div>
                  </div>
                  <div className="bg-[image-color] rounded-lg w-1/2 flex items-center justify-center">
                    ${imagePlaceholder}
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'left',
    mobile: 'Top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-lg p-[6%] flex flex-col">
                <div className="bg-[text-color] rounded-full w-1/2 h-[10%] mb-[6%]"></div>
                <div className="flex gap-[5%] flex-1">
                  <div className="bg-[image-color] rounded-lg w-1/2 flex items-center justify-center">
                    ${imagePlaceholder}
                  </div>
                  <div className="w-1/2 flex flex-col">
                    <div className="bg-[text-color] rounded-full w-full h-[8%] my-[3%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[8%] mb-[3%]"></div>
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'center',
    mobile: 'Top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-lg p-[6%] flex flex-col">
                <div className="bg-[text-color] rounded-full w-1/2 h-[10%] mb-[6%]"></div>
                                  <div className="bg-[image-color] h-3/4 rounded-lg flex items-center justify-center">
                    ${imagePlaceholder}
                  </div>
              </div>`,
  },
  {
    name: 'top',
    mobile: '2/3 Bottom image',
    preview: `<div className="size-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-col-reverse p-[6%]">
                <div className="h-1/2 w-full flex justify-end gap-[5%] pt-[5%]">                  
                  <div className='h-full w-1/2'>
                    <div className="bg-[text-color] rounded-full w-full h-[15%] mb-[3%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[15%] mb-[3%]"></div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-1/2 w-full rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
                <div className="bg-[text-color] rounded-full w-1/2 h-[10%] mb-[6%]"></div>
              </div>`,
  },
  {
    name: 'bottom',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-col p-[6%]">
                <div className="h-1/2 w-full flex gap-[5%]">                  
                  <div className="bg-[text-color] rounded-full w-1/2 h-[20%]"></div>
                  <div className='h-full w-1/2 pt-[10%]'>
                    <div className="bg-[text-color] rounded-full w-full h-[15%] mb-[5%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[15%] mb-[5%]"></div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-1/2 w-full rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'right-2/3',
    mobile: '2/3 Bottom image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-lg p-[6%] flex flex-col">
                <div className="bg-[text-color] rounded-full w-1/2 h-[10%] mb-[6%]"></div>
                <div className="flex gap-[5%] flex-1">
                  <div className="w-[40%] flex flex-col ">
                    <div className="bg-[text-color] rounded-full w-full h-[8%] my-[3%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[8%] mb-[3%]"></div>
                  </div>
                  <div className="bg-[image-color] rounded-lg w-[60%] flex items-center justify-center">
                    ${imagePlaceholder}
                  </div>
                </div>
              </div>`,
  },
  {
    name: 'left-2/3',
    mobile: '2/3 top image',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-lg p-[6%] flex flex-col">
                <div className="bg-[text-color] rounded-full w-1/2 h-[10%] mb-[6%]"></div>
                <div className="flex gap-[5%] flex-1">
                  <div className="bg-[image-color] rounded-lg w-[60%] flex items-center justify-center">
                    ${imagePlaceholder}
                  </div>
                  <div className="w-[40%] flex flex-col ">
                    <div className="bg-[text-color] rounded-full w-full h-[8%] my-[3%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[8%] mb-[3%]"></div>
                  </div>
                </div>
              </div>`,
  },
];

const closingSlideVariations: IVariation[] = [
  {
    name: 'left',
    mobile: 'Closing-slide layout',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-row-reverse gap-[5%] p-[6%]">
                <div className="h-full w-1/2 pt-[10%]">
                  <div className="bg-[text-color] rounded-full w-full h-[13%] mb-[6%]"></div>
                  <div className="bg-[text-color] rounded-full w-full h-[6%] mb-[3%]"></div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-full w-1/2 rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
  {
    name: 'top',
    mobile: 'Closing-slide layout',
    preview: `<div className="w-full aspect-video bg-[bg-color] rounded-[4px] rounded-lg flex flex-col-reverse p-[6%]">
                <div className="h-1/3 w-full flex gap-[5%] pt-[5%]">                  
                  <div className="bg-[text-color] rounded-full w-1/2 h-[22%]"></div>
                  <div className='h-full w-1/2'>
                    <div className="bg-[text-color] rounded-full w-full h-[15%] mb-[5%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[16%] mb-[5%]"></div>
                    <div className="bg-[text-color] rounded-full w-full h-[16%] mb-[5%]"></div>
                  </div>
                </div>
                <div className="bg-[image-color] rounded-[4px] h-2/3 w-full rounded-lg flex items-center justify-center">
                  ${imagePlaceholder}
                </div>
              </div>`,
  },
];

export const newSlideVariations: Record<string, IVariation[]> = {
  'image-text-slide': sideBarVariations,
  'bullet-points-slide': listVariations,
  'image-caption-slide': cardVariations,
  'text-slide': twoTextColVariations,
  'chart-slide': chartVariations,
  'content-slide': contentsVariations,
  'important-text-slide': importantTextVariations,
  'title-slide': titleSlideVariations,
  'section-headline-slide': sectionHeadlineSlideVariations,
  'shapes-slide': shapeSlideVariations,
  'images-slide': imageSlideVariations,
  'table-slide': tableSlideVariations,
  'free-slide': freeSlideVariations,
  'screen-slide': screenSlideVariations,
  'closing-slide': closingSlideVariations,
};

export const changableSlideVariations: Record<string, IVariation[]> = {
  'image-text-slide': sideBarVariations,
  'bullet-points-slide': listVariations,
  'image-caption-slide': cardVariations,
  'text-slide': twoTextColVariations,
  'chart-slide': chartVariations,
  'important-text-slide': importantTextVariations,
  'section-headline-slide': sectionHeadlineSlideVariations,
  'shapes-slide': shapeSlideVariations,
  'images-slide': imageSlideVariations,
  'table-slide': tableSlideVariations,
};

export const slideTitleMap: Record<string, string> = {
  'image-text-slide': 'Image-text slide',
  'bullet-points-slide': 'Bullet-points slide',
  'image-caption-slide': 'Image-caption slide',
  'text-slide': 'Text slide',
  'chart-slide': 'Chart slide',
  'content-slide': 'Content slide',
  'important-text-slide': 'Important-text slide',
  'title-slide': 'Title slide',
  'section-headline-slide': 'Section-headline slide',
  'shapes-slide': 'Shapes slide',
  'images-slide': 'Images slide',
  'table-slide': 'Table slide',
};
