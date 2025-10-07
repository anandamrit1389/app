import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import MainContainer from '@/components/Containers/MainContainer';
import { useTranslation } from 'react-i18next';
import DrawerHeader from '../DrawerHeader/DrawerHeader';
import { imageStyleCategories, imageStylesList } from './categories';
import ImageStyleCategoryItem from './ImageStyleCategoryItem';
import AIStar from '@/assets/ai-stars-3.svg?react';
import { cn } from '@/lib/utils';
import { ImageStyleCategory } from '@/interfaces/images-styles.interface';
import useMobile from '@/hooks/useMobile';
import useValidContext from '@/hooks/useValidContext';

const ImageStyleDrawer = () => {
  const {
    showStyleImageDrawer,
    handleStartWithTemplate,
    handleGenerate,
    handleToggleStyleImageDrawer,
    handleChangeSelectedImageStyle,
    selectedImageStyle,
  } = useValidContext();

  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  const [selectedCategory, setSelectedCategory] = useState<ImageStyleCategory>(
    imageStyleCategories[0],
  );

  const handleChangeSelectedCategory = (categoty: ImageStyleCategory) => {
    setSelectedCategory(categoty);
  };

  const filteredImageStyles = imageStylesList.filter(
    (style) =>
      style.categoryId === selectedCategory.id || (selectedCategory.id === 1 && style.isPopular),
  );

  if (isMobile) {
    return (
      <Sheet open={showStyleImageDrawer} onOpenChange={handleToggleStyleImageDrawer}>
        <SheetContent
          outsideclose="true"
          side="bottom"
          className="flex h-dvh justify-center rounded-t-xl p-0 pt-4"
        >
          <MainContainer>
            <div className="w-full">
              <DrawerHeader
                title={t('imageStyle')}
                onClose={handleToggleStyleImageDrawer}
                onPrevClick={handleStartWithTemplate}
                onNextClick={handleGenerate}
                nextBtnText={t('generatePresentation')}
                isDisabledNextButton={!selectedImageStyle}
              />

              <div className="flex items-center gap-2 overflow-x-auto p-0.5 pb-2 pt-4">
                {imageStyleCategories.map((imageStyleCategory) => (
                  <ImageStyleCategoryItem
                    key={imageStyleCategory.id}
                    onCategoryChange={handleChangeSelectedCategory}
                    isSelected={selectedCategory.id === imageStyleCategory.id}
                    imageStyleCategory={imageStyleCategory}
                  />
                ))}
              </div>

              {/* Image Styles Grid */}
              <div className="grid grid-cols-1 gap-4 p-1 pb-24 pt-4">
                {filteredImageStyles.map((style) => {
                  const categoryName =
                    selectedCategory.id === 1
                      ? imageStyleCategories.find((cat) => cat.id === style.categoryId)
                      : null;
                  return (
                    <div
                      onClick={() => handleChangeSelectedImageStyle(style)}
                      key={style.id}
                      className={cn(
                        'flex flex-col items-center cursor-pointer rounded-lg relative h-[140px] transition-all duration-200 hover:brightness-75',
                        {
                          'ring-2 ring-redText ring-offset-1': selectedImageStyle?.id === style.id,
                        },
                      )}
                    >
                      <div className="size-full">
                        {style.thumbSrc ? (
                          <img
                            src={style.thumbSrc}
                            alt={t(style.title)}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="size-full bg-disabled"></div>
                        )}
                        <div className="absolute inset-0 bg-darkBg/30 rounded-lg" />
                        {categoryName && (
                          <span className="absolute right-2 top-2 z-10 rounded-md bg-darkHeadline p-2 text-sm font-semibold uppercase leading-none text-white">
                            {t(categoryName.title)}
                          </span>
                        )}
                        <p className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-2xl font-bold text-white">
                          {style.isGenerated && <AIStar width="24" height="24" />}
                          {t(style.title)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* No Styles Found Message */}
              {filteredImageStyles.length === 0 && (
                <div className="py-8 text-center text-gray-500">{t('noCategoryStyles')}</div>
              )}
            </div>
          </MainContainer>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Sheet open={showStyleImageDrawer} onOpenChange={handleToggleStyleImageDrawer}>
      <SheetContent
        outsideclose="true"
        side="bottom"
        className="flex h-dvh justify-center rounded-t-xl p-0 pt-4 md:h-[95%] md:p-4"
      >
        <MainContainer>
          <div className="w-full">
            <DrawerHeader
              title={t('imageStyle')}
              onClose={handleToggleStyleImageDrawer}
              onPrevClick={handleStartWithTemplate}
              onNextClick={handleGenerate}
              nextBtnText={t('generatePresentation')}
              isDisabledNextButton={!selectedImageStyle}
            />

            <div className="flex items-center gap-2 overflow-x-auto p-0.5 pb-2 pt-4">
              {imageStyleCategories.map((imageStyleCategory) => (
                <ImageStyleCategoryItem
                  key={imageStyleCategory.id}
                  onCategoryChange={handleChangeSelectedCategory}
                  isSelected={selectedCategory.id === imageStyleCategory.id}
                  imageStyleCategory={imageStyleCategory}
                />
              ))}
            </div>

            {/* Image Styles Grid */}
            <div className="grid grid-cols-1 gap-4 p-1 pb-24 pt-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredImageStyles.map((style) => {
                const categoryName =
                  selectedCategory.id === 1
                    ? imageStyleCategories.find((cat) => cat.id === style.categoryId)
                    : null;
                return (
                  <div
                    onClick={() => handleChangeSelectedImageStyle(style)}
                    key={style.id}
                    className={cn(
                      'flex flex-col items-center cursor-pointer rounded overflow-hidden relative h-[140px] md:h-[220px] transition-all duration-200 hover:brightness-75',
                      {
                        'ring-2 ring-redText ring-offset-1': selectedImageStyle?.id === style.id,
                      },
                    )}
                  >
                    <div className="size-full">
                      {style.thumbSrc ? (
                        <img
                          src={style.thumbSrc}
                          alt={t(style.title)}
                          className="size-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="size-full bg-disabled"></div>
                      )}
                      <div className="absolute inset-0 bg-darkBg/30 rounded-lg" />
                      {categoryName && (
                        <span className="absolute right-2 top-2 z-10 rounded-md bg-darkHeadline p-2 text-sm font-semibold uppercase leading-none text-white">
                          {t(categoryName.title)}
                        </span>
                      )}
                      <p className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-2xl font-bold text-white">
                        {style.isGenerated && <AIStar width="24" height="24" />}
                        {t(style.title)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Styles Found Message */}
            {filteredImageStyles.length === 0 && (
              <div className="py-8 text-center text-gray-500">{t('noCategoryStyles')}</div>
            )}
          </div>
        </MainContainer>
      </SheetContent>
    </Sheet>
  );
};

export default ImageStyleDrawer;
