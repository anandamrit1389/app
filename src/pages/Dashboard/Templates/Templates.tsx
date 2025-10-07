import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TemplatesFilter from './components/TemplatesFilter';
import TemplatesSortOptions from './components/TemplatesSortOptions';
import useMobile from '@/hooks/useMobile';
import { CommonContext } from '@/contexts/Dashboard.context';
import TemplateCard from './components/TemplateCard';
import TemplateViewer from './components/TemplateViewer/TemplateViewer';
import { ITemplate } from '@/interfaces/ISlides';
import classNames from 'classnames';
import PresentationService from '@/api/presentationService';
import Loader from '@/assets/loader-color.svg?react';
import { ITemplatePreview } from '@/helpers/constants/presentation-templates.const';

const Templates = () => {
  const isMobile = useMobile();
  const { templates } = useContext(CommonContext);
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const [templatesList, setTemplatesList] = useState<ITemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('newest');
  const [showSort, setShowSort] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(null);

  const handleViewTemplate = (template: ITemplatePreview) => {
    const selectedTemplate = templatesList.find((t) => t.template === template.key);

    if (selectedTemplate) {
      setSelectedTemplate(selectedTemplate);
      setOpenViewer(true);
    }
  };

  useEffect(() => {
    const fetchTempaltes = async () => {
      try {
        setTemplatesLoading(true);
        const fetchedTemplates = await PresentationService.getAllTemplates();
        const orderedTemplates = templates
          .map((template) => fetchedTemplates.find((t) => t.template === template.key))
          .filter(Boolean) as ITemplate[];

        setTemplatesList(orderedTemplates);
      } catch (error) {
        console.error(error);
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTempaltes();
  }, []);

  useEffect(() => {
    setShowSort(false);
  }, [activeSort]);

  return (
    <>
      <div
        className={classNames('p-5 overflow-auto h-full', {
          'pt-9': !isMobile,
          'pt-0': isMobile,
        })}
      >
        <div className="flex w-full items-center justify-between">
          <p
            className={classNames('font-bold ', {
              'text-[24px]': !isMobile,
              'text-[20px]': isMobile,
            })}
          >
            {t('templates')}
          </p>
          {/* {isMobile && (
            <BaseButton variant="outline" onClick={() => setShowSort(!showSort)}>
              <Sort />
              {t('sort')}
            </BaseButton>
          )} */}
        </div>
        <div
          className={classNames('flex w-full justify-between', {
            'my-10': !isMobile,
            'my-4': isMobile,
          })}
        >
          <TemplatesFilter
            mobile={isMobile}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          {/* {!isMobile && (
            <div className="w-[200px]">
              <TemplatesSortOptions activeFilter={activeSort} setActiveFilter={setActiveSort} />
            </div>
          )} */}
        </div>

        {templatesLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <div
            className={classNames('grid', {
              'grid grid-cols-1 tablet:grid-cols-2 medium-desktop:grid-cols-3 big-desktop:grid-cols-4 huge-desktop:grid-cols-5 gap-x-4 gap-y-8':
                !isMobile,
              'grid-cols-2 gap-4': isMobile,
            })}
          >
            {templates.map((template) => {
              const templatePreviews = {
                src: template.src,
                name: template.name,
                key: template.key,
                length: template.length,
              };
              return (
                <div
                  onClick={() => handleViewTemplate(template)}
                  key={template.key}
                  className="cursor-pointer"
                >
                  <TemplateCard template={templatePreviews} mobile={isMobile} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedTemplate && (
        <TemplateViewer
          show={openViewer}
          onOpenChange={() => setOpenViewer(!openViewer)}
          mobile={isMobile}
          templateKey={selectedTemplate.template}
          templates={templatesList}
        />
      )}

      <TemplatesSortOptions
        menuOpen={showSort}
        onOpenChange={() => setShowSort(!showSort)}
        activeFilter={activeSort}
        setActiveFilter={setActiveSort}
        mobile
      />
    </>
  );
};

export default Templates;
