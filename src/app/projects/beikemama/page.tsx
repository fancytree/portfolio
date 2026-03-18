import React from 'react';

export default function BeikemamaProjectPage() {
  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero / Overview */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '120px',
          paddingBottom: '80px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {/* Back link */}
          <a
            href="/"
            style={{
              ...fontStyle,
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 400,
              color: 'oklch(0.556 0 0)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '40px',
            }}
          >
            ← Back to Work
          </a>

          {/* Title + intro */}
          <div
            style={{
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              paddingBottom: '24px',
              marginBottom: '32px',
            }}
          >
            <h1
              style={{
                ...fontStyle,
                fontSize: '40px',
                lineHeight: '52px',
                fontWeight: 300,
                color: '#171616',
                marginBottom: '16px',
              }}
            >
              Beikemama
            </h1>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '30px',
                fontWeight: 300,
                color: '#171616',
                maxWidth: '760px',
              }}
            >
              Bekommom is a live social product for pregnant women and families with children aged 0–6. By combining
              real-time streams, interactive Q&amp;A with experts or influencers, and parent–child activities, it helps
              users quickly gain practical parenting knowledge and exchange experiences with trustworthy communities.
            </p>
          </div>

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '64px',
            }}
          >
            <div
              style={{
                paddingRight: '24px',
                borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <div
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 300,
                  color: '#666666',
                  marginBottom: '4px',
                }}
              >
                Role
              </div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '24px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                Product Designer · UX & UI
              </div>
            </div>

            <div
              style={{
                paddingRight: '24px',
              }}
            >
              <div
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 300,
                  color: '#666666',
                  marginBottom: '4px',
                }}
              >
                Timeline
              </div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '24px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                2020 · 8 weeks
              </div>
            </div>

            <div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 300,
                  color: '#666666',
                  marginBottom: '4px',
                }}
              >
                Platform
              </div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '24px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                Mobile App · Community
              </div>
            </div>
          </div>

          {/* Hero visual with gradient background + cover image */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 8',
              borderRadius: '12px',
              overflow: 'hidden',
              background:
                'radial-gradient(circle at top left, rgba(235, 130, 146, 0.79), transparent 80%), radial-gradient(circle at bottom right, rgba(255, 234, 195, 0.6), transparent 80%), linear-gradient(135deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))',
              marginTop: 0,
              marginBottom: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/img/Beikemama/cover.avif"
              alt="Beikemama cover"
              style={{
                width: '88%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>

      {/* Structure sections (empty shells to fill later) */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingBottom: '96px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <h2
            style={{
              ...fontStyle,
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '16px',
            }}
          >
            Background
          </h2>
          <p
            style={{
              ...fontStyle,
              fontSize: '16px',
              lineHeight: '26px',
              fontWeight: 300,
              color: '#171616',
              maxWidth: '760px',
              marginBottom: '32px',
            }}
          >
            Benefiting from China&apos;s two-child policy, the number of newborns peaked at{' '}
            <strong style={{ fontWeight: 600 }}>17.86 million in 2016</strong> and still reached{' '}
            <strong style={{ fontWeight: 600 }}>14.65 million in 2019</strong>. The share of{' '}
            <strong style={{ fontWeight: 600 }}>second-child families</strong> keeps growing, making them a key focus
            for the maternal and infant market.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              columnGap: '80px',
              rowGap: '32px',
              alignItems: 'stretch',
              marginTop: '48px',
              marginBottom: '56px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                height: '100%',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Newly born population and birth rate from 2013 to 2019
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/img/Beikemama/Newly%20born%20population%20and%20birth%20rate.svg"
                  alt="Newly born population and birth rate from 2013 to 2019"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                height: '100%',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Proportion of children in the next three years
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/img/Beikemama/Proportion%20of%20children.svg"
                  alt="Proportion of children in the next three years"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/img/Beikemama/size%20of%20mother.webp"
                  alt="Size of mother user group"
                  style={{
                    width: '80%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)',
              gap: '120px',
              marginBottom: '64px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Age-specific fertility rates of women of childbearing age in China in 2019
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/img/Beikemama/Age-specific%20fertility%20rates.svg"
                  alt="Age-specific fertility rates of women of childbearing age in China in 2019"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '13px',
                  lineHeight: '20px',
                  fontWeight: 300,
                  color: '#666666',
                  margin: 0,
                }}
              >
                <strong style={{ fontWeight: 500 }}>Note:</strong>
                <br />
                1. Fertility rate = (Number of births / Average population during the year) × 1000‰.
                <br />
                2. Age-specific fertility rate: Number of live births per 1,000 women in a certain age group.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Number of active people in maternal and infant APPs (ten thousand)
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/img/Beikemama/Number%20of%20active%20people.svg"
                  alt="Number of active people in maternal and infant APPs"
                  style={{
                    width: '85%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <h4
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 500,
                    color: '#171616',
                    margin: 0,
                  }}
                >
                  Monthly expenditure on maternal and infant products
                </h4>
                <div
                  style={{
                    width: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/img/Beikemama/Monthly%20expenditure.svg"
                    alt="Monthly expenditure on maternal and infant products"
                    style={{
                      width: '64%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '13px',
                    lineHeight: '20px',
                    fontWeight: 300,
                    color: '#666666',
                    margin: 0,
                  }}
                >
                  Monthly consumption amount of maternal &amp; infant products:{' '}
                  <strong style={{ fontWeight: 500 }}>¥3456</strong>
                  <br />
                  The proportion of family monthly income occupied:{' '}
                  <strong style={{ fontWeight: 500 }}>26%</strong>
                </p>
              </div>
            </div>
          </div>
          <h3
            style={{
              ...fontStyle,
              fontSize: '22px',
              lineHeight: '30px',
              fontWeight: 500,
              color: '#171616',
              marginBottom: '16px',
            }}
          >
            Summary
          </h3>
          <ol
            style={{
              ...fontStyle,
              fontSize: '16px',
              lineHeight: '26px',
              fontWeight: 300,
              color: '#171616',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background:
                'linear-gradient(135deg, rgba(235,130,146,0.06), rgba(255,234,195,0.04))',
            }}
          >
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ fontWeight: 500 }}>1.</strong> China has a huge newborn population.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ fontWeight: 500 }}>2.</strong> The scale of the maternal and infant market constantly
              grows and is estimated to reach{' '}
              <strong style={{ fontWeight: 500 }}>3.25 trillion yuan in 2020</strong>. The main consumers are{' '}
              <strong style={{ fontWeight: 500 }}>young parents and youngsters in towns</strong>.
            </li>
            <li>
              <strong style={{ fontWeight: 500 }}>3.</strong> The overall active users of maternal and infant APPs
              increased by{' '}
              <strong style={{ fontWeight: 500 }}>over 70%</strong> from January 2018 to September 2019. Demographic
              dividend and migration trends promoted the rapid development of maternal and infant APPs.
            </li>
          </ol>

          
        </div>
      </section>

      {/* User research */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: 0,
          paddingBottom: '96px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <h2
            style={{
              ...fontStyle,
              fontSize: '28px',
              lineHeight: '36px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            User research
          </h2>
          <p
            style={{
              ...fontStyle,
              fontSize: '16px',
              lineHeight: '26px',
              fontWeight: 300,
              color: '#171616',
              maxWidth: '760px',
              marginBottom: '32px',
            }}
          >
            From first-tier to fourth-tier cities across China, we distributed online questionnaires to young mothers
            and fathers aged 20–45 with children aged 0–6. In total, we collected <strong style={{ fontWeight: 500 }}>2,500 valid survey responses</strong>.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '200px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Access to childcare information (Top 10)
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/img/Beikemama/Access%20to%20childcare%20information.svg"
                  alt="Access to childcare information (Top 10)"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Basic information of maternal and infant APP users
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/img/Beikemama/Basic%20information.svg"
                  alt="Basic information of maternal and infant APP users"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>

          <h2
            style={{
              ...fontStyle,
              fontSize: '24px',
              lineHeight: '28px',
              fontWeight: 400,
              color: '#171616',
              marginTop: '40px',
              marginBottom: '12px',
            }}
          >
            User interview
          </h2>
          <p
            style={{
              ...fontStyle,
              fontSize: '16px',
              lineHeight: '26px',
              fontWeight: 300,
              color: '#171616',
              maxWidth: '760px',
              marginBottom: '40px',
            }}
          >
            This interview involved parents and elders who are either preparing for pregnancy or already have children
            at home, in order to explore the real needs of the maternal and infant group and differences in user
            behaviour.
            <br />
            <br />
            <strong style={{ fontWeight: 500 }}>Research method:</strong> Online audio and video interviews.
            <br />
            <strong style={{ fontWeight: 500 }}>Research size:</strong> 15 participants.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              columnGap: '64px',
              rowGap: '40px',
              alignItems: 'flex-start',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Time for young parents to start learning parenting knowledge
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/img/Beikemama/Time.svg"
                  alt="Time for young parents to start learning parenting knowledge"
                  style={{
                    width: '72%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Parenting anxiety of the new generation of parents
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/img/Beikemama/Cloud.svg"
                  alt="Parenting anxiety of the new generation of parents"
                  style={{
                    width: '72%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Treatment of generation-skipping difference / divergence points
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/img/Beikemama/Treatment.svg"
                  alt="Treatment of generation-skipping difference and divergence points"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingBottom: '96px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2.3fr) minmax(0, 4fr)',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Generation-skipping divergence points (TOP 3)
              </h3>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/img/Beikemama/Divergence%20points.svg"
                  alt="Generation-skipping divergence points (TOP 3)"
                  style={{
                    width: '72%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Here is a summary of their pain points and needs:
              </h3>
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  background:
                    'linear-gradient(135deg, rgba(235,130,146,0.04), rgba(255,234,195,0.02))',
                }}
              >
                <ul
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '26px',
                    fontWeight: 300,
                    color: '#171616',
                    margin: 0,
                  }}
                >
                  <li style={{ marginBottom: '8px' }}>
                    <strong style={{ fontWeight: 500 }}>1.</strong> Postpartum mothers feel less attractive and confident.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong style={{ fontWeight: 500 }}>2.</strong> The process of accompanying children often feels dull and
                    repetitive.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong style={{ fontWeight: 500 }}>3.</strong> They experience high stress, mental tension, and
                    sometimes strained family relationships.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong style={{ fontWeight: 500 }}>4.</strong> They prefer interactive games and activities between
                    parents and children.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong style={{ fontWeight: 500 }}>5.</strong> They highly value early childhood education and
                    developmental stimulation for their babies.
                  </li>
                  <li>
                    <strong style={{ fontWeight: 500 }}>6.</strong> They hope to obtain parenting information in a relaxed
                    and enjoyable manner rather than through dry or overwhelming channels.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Persona */}
          <div
            style={{
              marginTop: '80px',
            }}
          >
            <h2
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 300,
                color: '#171616',
                marginBottom: '32px',
              }}
            >
              Persona
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                columnGap: '64px',
                rowGap: '64px',
              }}
            >
              <div>
                <img
                  src="/img/Beikemama/Persona%201.avif"
                  alt="Persona 1"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
              <div>
                <img
                  src="/img/Beikemama/Persona%202.avif"
                  alt="Persona 2"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
              <div>
                <img
                  src="/img/Beikemama/Persona%203.avif"
                  alt="Persona 3"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
              <div>
                <img
                  src="/img/Beikemama/Persona%204.avif"
                  alt="Persona 4"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Competitive product analysis */}
          <div
            style={{
              marginTop: '96px',
            }}
          >
            <h2
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 300,
                color: '#171616',
                marginBottom: '16px',
              }}
            >
              Competitive product analysis
            </h2>
            <p
              style={{
                ...fontStyle,
                fontSize: '16px',
                lineHeight: '26px',
                fontWeight: 300,
                color: '#171616',
                maxWidth: '760px',
                marginBottom: '32px',
              }}
            >
              The selected competing products are the three most active apps in the maternal and infant integrated
              community, which helps reflect current user needs, content tendencies, and interaction patterns in this
              space.
            </p>
            <div
              style={{
                width: '100%',
                maxWidth: '1200px',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Beikemama/Competition.avif"
                alt="Competitive product analysis for Bekommom"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>

            {/* Opportunity */}
            <div
              style={{
              marginTop: '40px',
              }}
            >
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 300,
                  color: '#171616',
                  marginBottom: '16px',
                }}
              >
                Opportunity
              </h2>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '26px',
                  fontWeight: 300,
                  color: '#171616',
                  maxWidth: '760px',
                  marginBottom: '40px',
                }}
              >
                According to the questions raised, over <strong style={{ fontWeight: 500 }}>40</strong> related creative
                points and function points were identified as directions for future design opportunities.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 4fr)',
                  gap: '40px',
                  alignItems: 'flex-start',
                  marginTop: '32px',
                }}
              >
                {/* 左侧：上下两个容器 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  }}
                >
                  {/* Reply in time */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto minmax(0, 1fr)',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src="/img/Beikemama/Reply%20in%20time.webp"
                        alt="Reply in time icon"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <h3
                        style={{
                          ...fontStyle,
                          fontSize: '18px',
                          lineHeight: '24px',
                          fontWeight: 500,
                          color: '#171616',
                          margin: 0,
                        }}
                      >
                        Reply in time
                      </h3>
                      <p
                        style={{
                          ...fontStyle,
                          fontSize: '16px',
                          lineHeight: '24px',
                          fontWeight: 300,
                          color: '#171616',
                          margin: 0,
                        }}
                      >
                        Novice mothers need timely, professional parenting knowledge. Live streaming with{' '}
                        <strong style={{ fontWeight: 500 }}>doctors and experienced mothers</strong> provides quick,
                        reliable answers.
                      </p>
                    </div>
                  </div>

                  {/* Psychological relief */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto minmax(0, 1fr)',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src="/img/Beikemama/Psychological%20relief.webp"
                        alt="Psychological relief icon"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <h3
                        style={{
                          ...fontStyle,
                          fontSize: '18px',
                          lineHeight: '24px',
                          fontWeight: 500,
                          color: '#171616',
                          margin: 0,
                        }}
                      >
                        Psychological relief
                      </h3>
                      <p
                        style={{
                          ...fontStyle,
                          fontSize: '16px',
                          lineHeight: '24px',
                          fontWeight: 300,
                          color: '#171616',
                          margin: 0,
                        }}
                      >
                        Pregnant mothers and caregivers face high stress and need people who truly understand them.{` `}
                        <strong style={{ fontWeight: 500 }}>Professional counselors</strong> and supportive communities
                        help ease worries.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 右侧：NUF 图片 */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/img/Beikemama/NUF.avif"
                    alt="NUF concept visualization"
                    style={{
                      width: '80%',
                      maxWidth: '600px',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
              </div>

              {/* Summary 模块 */}
              <div
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                {/* 左侧装饰条 */}
                <div
                  style={{
                    width: '4px',
                    borderRadius: '999px',
                    background:
                      'linear-gradient(180deg, rgba(255, 204, 153, 0.9) 0%, rgba(255, 153, 204, 0.9) 50%, rgba(153, 204, 255, 0.9) 100%)',
                    minHeight: '96px',
                  }}
                />

                <div>
                  <h2
                    style={{
                      ...fontStyle,
                      fontSize: '24px',
                      lineHeight: '32px',
                      fontWeight: 300,
                      color: '#171616',
                      margin: 0,
                      marginBottom: '12px',
                    }}
                  >
                    Summary
                  </h2>
                  <ol
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '26px',
                      fontWeight: 300,
                      color: '#171616',
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <li>
                      The advantages of live streaming include timely feedback, powerful social communication, and
                      diversified ways of knowledge imparting.
                    </li>
                    <li>
                      A comprehensive maternal and infant social platform combining live streaming and community.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Concept 模块 */}
              <div
                style={{
                  marginTop: '48px',
                }}
              >
                <h2
                  style={{
                    ...fontStyle,
                    fontSize: '28px',
                    lineHeight: '36px',
                    fontWeight: 300,
                    color: '#171616',
                    margin: 0,
                    marginBottom: '16px',
                  }}
                >
                  Concept
                </h2>


              <h3
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '28px',
                    fontWeight: 400,
                    color: '#171616',
                    margin: 0,
                    marginBottom: '16px',
                  }}
                >
                  Information Architecture
                </h3>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '1200px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/img/Beikemama/Information%20Architecture.avif"
                    alt="Information architecture for Bekommom"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: '32px',
                  }}
                >
                  <h3
                    style={{
                      ...fontStyle,
                      fontSize: '20px',
                      lineHeight: '28px',
                      fontWeight: 400,
                      color: '#171616',
                      margin: 0,
                      marginBottom: '12px',
                    }}
                  >
                    Low-Fidelity
                  </h3>
                  <h4
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: '#171616',
                      margin: 0,
                      marginBottom: '12px',
                    }}
                  >
                    Main flow of live broadcast
                  </h4>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '1200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src="/img/Beikemama/Main%20flow.avif"
                      alt="Main flow of live broadcast"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '32px',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
                    gap: '100px',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* 左侧：Live Interaction-Paid Q&A */}
                  <div>
                    <h4
                      style={{
                        ...fontStyle,
                        fontSize: '16px',
                        lineHeight: '24px',
                        fontWeight: 400,
                        color: '#171616',
                        margin: 0,
                        marginBottom: '12px',
                      }}
                    >
                      Live Interaction-Paid Q&amp;A
                    </h4>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '1000px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src="/img/Beikemama/Live%20Interaction.avif"
                        alt="Live interaction paid Q&A"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                        }}
                      />
                    </div>
                  </div>

                  {/* 右侧：Interactive Game */}
                  <div>
                    <h4
                      style={{
                        ...fontStyle,
                        fontSize: '16px',
                        lineHeight: '24px',
                        fontWeight: 400,
                        color: '#171616',
                        margin: 0,
                        marginBottom: '12px',
                      }}
                    >
                      Interactive Game
                    </h4>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '340px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src="/img/Beikemama/Interactive%20Game.avif"
                        alt="Interactive game live feature"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Design System 模块 */}
                <div
                  style={{
                    marginTop: '56px',
                    marginLeft: '50%',
                    transform: 'translateX(-50%)',
                    width: '100vw',
                    backgroundColor: '#FF7876',
                    backgroundImage: 'url("/img/Beikemama/Design%20System.avif")',
                    backgroundSize: 'auto 200%',
                    backgroundPosition: 'left 30%',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '1200px',
                      margin: '0 auto',
                      padding: '80px 24px 640px 24px',
                    }}
                  >
                    {/* Design System 模块内容：替换为指定文章（保持外框与背景不变） */}
                    <div
                      className="design-system-content"
                      style={{
                        // 让内容样式只在该模块生效
                        backgroundColor: 'transparent',
                      }}
                    >
                      <style>{`
                        .design-system-content{
                          --primary: #2563eb;
                          --text-main: #1f2937;
                          --text-muted: #4b5563;
                          --bg-main: transparent;
                          --bg-card: #ffffff;
                          --border: #e5e7eb;
                          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                          line-height: 1.6;
                          color: var(--text-main);
                        }
                        .design-system-content header{
                          background-color: var(--primary);
                          color: white;
                          padding: 4rem 2rem;
                          text-align: center;
                          border-radius: 12px;
                        }
                        .design-system-content header h1{
                          margin: 0 0 1rem 0;
                          font-size: 2.5rem;
                          font-weight: 700;
                        }
                        .design-system-content header p{
                          font-size: 1.2rem;
                          opacity: 0.95;
                          max-width: 800px;
                          margin: 0 auto;
                        }
                        .design-system-content .container{
                          max-width: 1000px;
                          margin: 2rem auto;
                          padding: 0 2rem;
                        }
                        .design-system-content .hero-img{
                          width: 100%;
                          height: auto;
                          border-radius: 12px;
                          margin: -3rem 0 3rem 0;
                          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                          display: block;
                        }
                        .design-system-content section{
                          background: var(--bg-card);
                          padding: 2.5rem;
                          border-radius: 12px;
                          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                          margin-bottom: 2rem;
                        }
                        .design-system-content h2{
                          color: var(--primary);
                          border-bottom: 2px solid var(--border);
                          padding-bottom: 0.5rem;
                          margin-top: 0;
                          font-size: 1.6rem;
                        }
                        .design-system-content h3{
                          color: #111827;
                          margin-top: 1.5rem;
                          font-size: 1.1rem;
                        }
                        .design-system-content ul{
                          padding-left: 1.5rem;
                          margin: 0.75rem 0 0;
                        }
                        .design-system-content li{
                          margin-bottom: 0.75rem;
                        }
                        .design-system-content .img-placeholder{
                          width: 100%;
                          border-radius: 8px;
                          margin: 1.5rem 0;
                          border: 1px solid var(--border);
                          display: block;
                        }
                        .design-system-content .highlight{
                          font-weight: bold;
                          color: var(--primary);
                        }
                        .design-system-content .citation{
                          color: var(--text-muted);
                          font-size: 0.85em;
                          vertical-align: super;
                        }
                      `}</style>

                      <header>
                        <h1>Decoding 12 Leading Design Systems</h1>
                        <p>
                          A 3-Layer Framework: Trend Analysis, Company Breakdown, and Practical Methods for Tomorrow's
                          UI
                        </p>
                      </header>

                      <div className="container">
                        <img
                          src="https://placehold.co/1000x400/2563eb/ffffff?text=Design+System+Coordinate+Matrix"
                          alt="Design System Coordinate Matrix"
                          className="hero-img"
                        />

                        <section>
                          <h2>Introduction: The Dual-Axis Coordinate System</h2>
                          <p>
                            To thoroughly understand the 12 most representative design systems in the industry, we have
                            constructed a <strong>Dual-Axis Coordinate System</strong>:
                          </p>
                          <ul>
                            <li>
                              <strong>X-Axis (Design Philosophy):</strong> The left side represents &quot;Ultimate
                              Business Efficiency &amp; Standardization (B2B)&quot;, while the right side represents &quot;Intense
                              Emotional Expression &amp; Individuality (B2C)&quot;.
                            </li>
                            <li>
                              <strong>Y-Axis (Technical Infrastructure):</strong> The bottom represents &quot;Cross-Platform
                              Consistency &amp; Multi-Framework Compatibility&quot;, while the top represents &quot;AI-Driven &amp; Spatial/Physical
                              Adaptability&quot;.
                            </li>
                          </ul>
                          <p>
                            Under this coordinate system, digital product design is undergoing a massive paradigm shift. The era
                            of &quot;Homogenization&quot; and boring applications is coming to an end. Future design systems will no longer be
                            mere UI libraries, but &quot;living architectures&quot; that integrate AI, emotions, and cross-device
                            adaptability.
                          </p>
                        </section>

                        <section>
                          <h2>Layer 1: Trend Analysis — Three Major Winds of Change</h2>
                          <img
                            src="https://placehold.co/800x300/f3f4f6/4b5563?text=Trend+1:+Expressive+Design+|+Trend+2:+AI+Native+|+Trend+3:+Underlying+Restructure"
                            alt="Three Major Trends"
                            className="img-placeholder"
                          />
                          <ol>
                            <li>
                              <strong>From Minimalist to &quot;Expressive&quot; Sensory Return:</strong> After a decade of
                              standardization making software lose its soul, emotional design has returned to the core. Systems now
                              emphasize physical world metaphors and micro-interactions, such as spring-based physics, shape morphing,
                              and translucent glass materials, enhancing user cognitive and emotional connections{' '}
                              <span className="citation">[1-3]</span>.
                            </li>
                            <li>
                              <strong>AI Evolves from &quot;Auxiliary Tool&quot; to &quot;Native Component&quot;:</strong> Design
                              systems no longer just dictate button aesthetics; they govern how AI converses with humans. Leading
                              systems natively integrate generative AI chat components, AI output labels, and dedicated Copilot UI toolkits{' '}
                              <span className="citation">[4-6]</span>.
                            </li>
                            <li>
                              <strong>Radical Underlying Restructure:</strong> Bloated CSS-in-JS runtimes are being
                              discarded in favor of pure CSS Variables and Design Tokens{' '}
                              <span className="citation">[7, 8]</span>. Furthermore, to accommodate upcoming multi-hinge foldables
                              and XR spatial computing, UI layouts are shifting from hardcoded breakpoints to &quot;Window Size Classes&quot;
                              and 3D spatial flexbox architectures{' '}
                              <span className="citation">[9-11]</span>.
                            </li>
                          </ol>
                        </section>

                        <section>
                          <h2>Layer 2: Company Breakdown — 12 Systems in the Coordinate Grid</h2>

                          <h3>Quadrant 1: Pioneers of Emotion &amp; Senses (Top Right)</h3>
                          <p>These systems break homogenization by emphasizing physical textures and strong emotional resonance.</p>
                          <ul>
                            <li>
                              <strong>1. Apple (Liquid Glass):</strong> Introduced in macOS Tahoe 26 and iOS 26, this &quot;liquid
                              glass&quot; material features dynamic blur, light refraction, and 3D depth <span className="citation">[1, 12]</span>.
                              Controls float above content, reacting to device movement with fluid, droplet-like animations{' '}
                              <span className="citation">[1, 2]</span>.
                            </li>
                            <li>
                              <strong>2. Google (Material 3 Expressive):</strong> Based on 46 studies and 18,000+ participants, this
                              update introduces spring physics, 35 new shapes, and larger interactive elements{' '}
                              <span className="citation">[3, 13, 14]</span>. It boosts visual appeal and enables users to spot key actions up to
                              4x faster <span className="citation">[15]</span>.
                            </li>
                            <li>
                              <strong>3. Meta (Horizon OS Spatial UI):</strong> Built for XR and spatial computing, it uses an HTML/CSS-like{' '}
                              <code>uikitml</code> markup language to bring Flexbox layouts into 3D space, supporting natural physical interactions{' '}
                              <span className="citation">[11, 16]</span>.
                            </li>
                          </ul>

                          <img
                            src="https://placehold.co/800x300/f3f4f6/4b5563?text=Enterprise+%26+AI+Engines"
                            alt="Enterprise AI Engines"
                            className="img-placeholder"
                          />

                          <h3>Quadrant 2: Engines of AI &amp; R&amp;D Efficiency (Top Left)</h3>
                          <p>The backbone of modern enterprise applications, solving production synergy and AI integration.</p>
                          <ul>
                            <li>
                              <strong>4. ByteDance (Semi Design):</strong> Its core strength is Design to Code (D2C) and Code to
                              Design (C2D) tech. Offering 3000+ Design Tokens, it allows one-click conversion from Figma to React/Vue
                              code, bridging DesignOps and DevOps <span className="citation">[17, 18]</span>.
                            </li>
                            <li>
                              <strong>5. Ant Group (Ant Design 6.0 &amp; Ant Design X):</strong> Upgraded to a pure CSS variables
                              architecture with &quot;zero-runtime&quot; capabilities and semantic DOM transformation, dropping IE support
                              entirely <span className="citation">[7, 19, 20]</span>. Its companion, Ant Design X, provides powerful rendering for
                              AI-driven interfaces <span className="citation">[21]</span>.
                            </li>
                            <li>
                              <strong>6. Salesforce (Lightning Design System 2 - SLDS 2):</strong> Prioritizing CSS custom properties,
                              it combines Pro-code control with No-code design <span className="citation">[8, 22]</span>. It includes &quot;Agentic Patterns&quot;
                              tailored for generative AI experiences in CRM <span className="citation">[22]</span>.
                            </li>
                          </ul>

                          <h3>Quadrant 3: Cross-Platform Consistency &amp; E-commerce/Content Matrices (Bottom Left)</h3>
                          <ul>
                            <li>
                              <strong>7. Tencent (TDesign):</strong> A model for enterprise open source, maintaining highly consistent APIs
                              across independent codebases for Vue, React, Miniprogram, and Flutter <span className="citation">[23, 24]</span>.
                            </li>
                            <li>
                              <strong>8. Shopify (Polaris):</strong> The benchmark for e-commerce. With 60+ specialized components (e.g., complex data tables),
                              its Telescope Sketch/Figma plugin ensures seamless handoffs, reducing development time by up to 40%{' '}
                              <span className="citation">[25-27]</span>.
                            </li>
                            <li>
                              <strong>9. IBM (Carbon Design System):</strong> Renowned for rigorous data visualization, IBM Plex typography, and a 2x Grid system,
                              ensuring absolute accessibility for enterprise software <span className="citation">[28, 29]</span>.
                            </li>
                            <li>
                              <strong>10. Amazon (Cloudscape):</strong> Built for high data-density cloud products. It features &quot;Compact&quot; and &quot;Comfortable&quot;
                              density modes and provides native patterns for generative AI chats and artifact previews <span className="citation">[30, 31]</span>.
                            </li>
                          </ul>

                          <h3>Quadrant 4: Predictive &amp; System-Level Integration (Spanning the Center)</h3>
                          <ul>
                            <li>
                              <strong>11. Airbnb (DLS):</strong> Uses AI to analyze user behavior, predict needs, and automatically optimize search layout presentations,
                              utilizing AI as a foundational UX structuring tool <span className="citation">[32, 33]</span>.
                            </li>
                            <li>
                              <strong>12. Microsoft (Fluent 2):</strong> Pushing the &quot;One Microsoft&quot; vision across Web, iOS, Android, and Windows. It features specialized{' '}
                              <em>Copilot UI Kits</em> to foster consistent AI experiences while maintaining cross-platform fluidity <span className="citation">[4, 34]</span>.
                            </li>
                          </ul>
                        </section>

                        <section>
                          <h2>Layer 3: Practical Methods — What Should Your Team Change Tomorrow?</h2>
                          <img
                            src="https://placehold.co/800x300/f3f4f6/4b5563?text=5+Actionable+Directives+for+Design+Teams"
                            alt="5 Actionable Directives"
                            className="img-placeholder"
                          />
                          <p>The best design system is not the most restrictive, but the most empowering. Here are 5 immediate action items for your team:</p>

                          <ol>
                            <li>
                              <span className="highlight">Directive 1: Execute a Core Restructure to Pure CSS Variables &amp; Tokens.</span> Stop writing hardcoded hex colors and drop heavy CSS-in-JS runtimes.
                              Establish semantic Design Tokens (like Ant Design 6.0 and Shopify Polaris) to easily implement dark mode, reduce tech debt, and facilitate multi-brand white-labeling{' '}
                              <span className="citation">[7, 35, 36]</span>.
                            </li>
                            <li>
                              <span className="highlight">Directive 2: Introduce &quot;AI Native&quot; Agentic Patterns.</span> Don't just patch a chat bubble onto your UI. Formalize AI patterns:
                              Generative AI chat templates, output trust labels, and user authorization mechanisms (referencing Cloudscape and Fluent 2){' '}
                              <span className="citation">[4-6]</span>.
                            </li>
                            <li>
                              <span className="highlight">Directive 3: Implement D2C (Design-to-Code) Workflows.</span> Integrate tools like Semi Design or Shopify Telescope. Map Figma parameters directly to React components to cut interface building time by over 40% and eliminate pixel deviations{' '}
                              <span className="citation">[18, 26, 27]</span>.
                            </li>
                            <li>
                              <span className="highlight">Directive 4: Inject &quot;Micro-emotions&quot; into Key Interactions.</span> Borrow from Material 3 Expressive: focus on your &quot;Hero moments&quot;.
                              Add spring physics to primary buttons and introduce varied shape transitions to make navigation feel alive without violating accessibility standards{' '}
                              <span className="citation">[3, 14]</span>.
                            </li>
                            <li>
                              <span className="highlight">Directive 5: Abandon Absolute Breakpoints for &quot;Window Size Classes&quot;.</span> Prepare for the 2026 tri-fold device surge. Stop hardcoding mobile/desktop CSS media queries. Use Compact, Medium, and Expanded states, ensuring UI state continuity (using ViewModel) so users never lose their input when unfolding a device{' '}
                              <span className="citation">[9, 10, 37]</span>.
                            </li>
                          </ol>

                          <p>
                            <strong>Conclusion:</strong> Your team's goal for tomorrow is singular:{' '}
                            <em>Trade tokens for consistency, trade D2C for time, and invest that freed-up time into sculpting AI experiences and emotional interactions.</em>
                          </p>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hi-Fi Prototype 模块 */}
                <div
                  style={{
                    marginTop: '56px',
                  }}
                >
                  <h2
                    style={{
                      ...fontStyle,
                      fontSize: '28px',
                      lineHeight: '36px',
                      fontWeight: 300,
                      color: '#171616',
                      margin: 0,
                      marginBottom: '16px',
                    }}
                  >
                    Hi-Fi Prototype
                  </h2>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '1200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      margin: '0 auto',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src="/img/Beikemama/Hi-Fi%20Prototype.avif"
                      alt="Bekommom hi-fi prototype"
                      style={{
                        width: '72%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: '32px',
                      width: '100%',
                      maxWidth: '1200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginInline: 'auto',
                    }}
                  >
                    <img
                      src="/img/Beikemama/Hi-Fi%20Prototype%201.avif"
                      alt="Bekommom hi-fi prototype screens 1"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: '24px',
                      width: '100%',
                      maxWidth: '1200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginInline: 'auto',
                    }}
                  >
                    <img
                      src="/img/Beikemama/Hi-Fi%20Prototype%202.avif"
                      alt="Bekommom hi-fi prototype screens 2"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: '24px',
                      width: '100%',
                      maxWidth: '1200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginInline: 'auto',
                    }}
                  >
                    <img
                      src="/img/Beikemama/Hi-Fi%20Prototype%203.avif"
                      alt="Bekommom hi-fi prototype screens 3"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

