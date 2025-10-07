import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';

interface IItem {
  name: string;
}

interface IFeature {
  name: string;
  items: IItem[];
}

interface ISubscriptionPlan {
  name: string;
  price: {
    amount: number;
    period: string;
  };
  bgColor: string;
  description: string;
  buttonLabel: string;
  additionalInfo?: string;
  features: IFeature[];
}

interface ISubscriptionSection {
  title: string;
  description: string;
  subscriptionPlans: ISubscriptionPlan[];
}

const section: ISubscriptionSection = {
  title: 'Subscriptions',
  description: 'Choose the plan that works for you',
  subscriptionPlans: [
    {
      name: 'Free',
      description: 'Enjoy seamless design and stunning visuals at no cost. ',
      price: {
        amount: 0,
        period: 'month',
      },
      bgColor: '#FFFFFF',
      buttonLabel: 'SELECT PLAN',
      features: [
        {
          name: 'Features',
          items: [
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
          ],
        },
      ],
    },
    {
      name: 'Pro',
      description: 'Enjoy seamless design and stunning visuals at no cost.',
      price: {
        amount: 0,
        period: 'month',
      },
      buttonLabel: 'SELECT PLAN',
      additionalInfo: 'Everthing in free, plus:',
      bgColor: '#D1D5DB',
      features: [
        {
          name: 'Admin',
          items: [
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
          ],
        },
        {
          name: 'Design',
          items: [
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
          ],
        },
      ],
    },
    {
      name: 'Organiziation',
      description: 'Enjoy seamless design and stunning visuals at no cost.',
      price: {
        amount: 0,
        period: 'month',
      },
      buttonLabel: 'SELECT PLAN',
      bgColor: '#F0E9D5',
      additionalInfo: 'Everthing in pro, plus:',
      features: [
        {
          name: 'Sharing',
          items: [
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
          ],
        },
        {
          name: 'Features',
          items: [
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
            {
              name: 'Item',
            },
          ],
        },
      ],
    },
  ],
};

const SubscriptionsSection = () => {
  return (
    <div
      className="mx-4 flex flex-col
            bg-[#1F2937] px-8 py-14
            tablet:mx-8 tablet:px-0 tablet:py-14
            small-desktop:mx-[152px] small-desktop:px-0 small-desktop:py-20
        "
    >
      <div className="">
        <h1 className="mb-3 text-center font-semibold text-[#F6F7F8] text-secondaryTitle">
          {section.title}
        </h1>
        <h1 className="text-center font-semibold text-lightGreyPress text-bodyLarge">
          {section.description}
        </h1>
      </div>
      <div className="mb-12 mt-10 flex flex-col justify-around gap-3 tablet:flex-row ">
        {section.subscriptionPlans.map((plan) => {
          return (
            <div
              key={plan.name}
              className="basis-1/5 rounded-lg p-4 md:basis-3/12"
              style={{ backgroundColor: plan.bgColor }}
            >
              <h1 className="mb-3 font-semibold text-darkHeadline text-sectionTitle">
                {plan.name}
              </h1>
              <p className="mb-3 font-semibold text-darkHeadline text-sectionTitle">
                {`$${plan.price.amount}`}/
                <span className="text-bodySmall">{plan.price.period}</span>
              </p>
              <p className="mb-3 text-darkText text-bodyMedium">{plan.description}</p>
              <div className="mb-3 flex flex-col items-center">
                <BaseButton classNames="uppercase">{plan.buttonLabel}</BaseButton>
              </div>
              <p className="mb-3 text-darkText text-bodyMedium">{plan.additionalInfo}</p>
              <div className="flex flex-col">
                {plan.features.map((feat, i) => {
                  return (
                    <div key={i} className="mb-2 flex flex-col">
                      <h1 className="mb-1 font-semibold text-darkHeadline">{feat.name}</h1>
                      <ul>
                        {feat.items.map((item, i) => (
                          <li className="text-darkText" key={i}>
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionsSection;
