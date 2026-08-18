import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';

export default function CalendarPage({ batchId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(Boolean(batchId));
  const [error, setError] = useState('');

  // Load calendar events from the backend.
  useEffect(() => {
    if (!batchId) return;

    async function loadCalendar() {
      try {
        setLoading(true);
        setError('');

        const response = await axiosInstance.get('/calendar', {
          params: {
            batchId,
          },
        });

        setEvents(response?.data?.data || []);
      } catch (error) {
        console.error('Failed to load calendar:', error);

        setError(
          error?.response?.data?.message ||
            'Could not load calendar events.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadCalendar();
  }, [batchId]);

  return (
    <div className="
      min-h-screen
      bg-[#051C14]
      px-4 py-6
      sm:px-6
      lg:px-8
    ">
      <div className="mx-auto max-w-7xl">

        <motion.header
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">

            {/* MSJ Logo */}
            <div className="
              flex
              h-12 w-12
              items-center
              justify-center
              rounded-xl
              border border-[#D4AF37]/40
              bg-[#051C14]
              shadow-[0_0_20px_rgba(212,175,55,0.12)]
            ">
              <div className="
                flex
                h-9 w-9
                items-center
                justify-center
                rounded-lg
                border border-[#D4AF37]/15
              ">
                <span className="
                  text-sm
                  font-bold
                  tracking-wider
                  text-[#D4AF37]
                ">
                  MSJ
                </span>
              </div>
            </div>

            <div>
              <p className="
                text-xs
                uppercase
                tracking-[0.2em]
                text-[#D4AF37]
              ">
                ASTU MSJ
              </p>

              <h1 className="
                mt-1
                text-2xl
                font-bold
                text-[#F8F9FA]
                sm:text-3xl
              ">
                Calendar
              </h1>

              <p className="
                mt-1
                text-sm
                text-[#F8F9FA]/55
              ">
                Upcoming bootcamp events and important dates
              </p>
            </div>

          </div>
        </motion.header>

        {!batchId && (
          <div className="
            rounded-2xl
            border border-[#D4AF37]/20
            bg-[rgba(10,35,26,0.75)]
            p-10
            text-center
            backdrop-blur-[16px]
          ">
            <div className="
              mb-4
              flex
              justify-center
            ">
              <div className="
                flex
                h-14 w-14
                items-center
                justify-center
                rounded-xl
                border border-[#D4AF37]/40
                bg-[#051C14]
              ">
                <span className="
                  text-sm
                  font-bold
                  tracking-wider
                  text-[#D4AF37]
                ">
                  MSJ
                </span>
              </div>
            </div>

            <h2 className="
              text-lg
              font-semibold
              text-[#F8F9FA]
            ">
              No Batch Selected
            </h2>

            <p className="
              mt-2
              text-sm
              text-[#F8F9FA]/55
            ">
              Select a batch to view its upcoming events.
            </p>
          </div>
        )}

        {batchId && loading && (
          <div className="
            rounded-2xl
            border border-[#D4AF37]/20
            bg-[rgba(10,35,26,0.75)]
            p-12
            text-center
            backdrop-blur-[16px]
          ">
            <p className="
              text-sm
              text-[#F8F9FA]/60
            ">
              Loading calendar...
            </p>
          </div>
        )}

        {batchId && !loading && error && (
          <div className="
            rounded-2xl
            border border-red-400/20
            bg-[rgba(10,35,26,0.75)]
            p-8
            text-center
            backdrop-blur-[16px]
          ">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {batchId &&
          !loading &&
          !error &&
          events.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="
                relative
                overflow-hidden
                rounded-2xl
                border border-[#D4AF37]/30
                bg-[rgba(10,35,26,0.75)]
                p-12
                text-center
                backdrop-blur-[16px]
              "
            >
              <div className="
                absolute
                top-0
                left-0
                right-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-[#D4AF37]
                to-transparent
              " />

              <div className="
                mb-4
                flex
                justify-center
              ">
                <div className="
                  flex
                  h-14 w-14
                  items-center
                  justify-center
                  rounded-xl
                  border border-[#D4AF37]/40
                  bg-[#051C14]
                ">
                  <span className="
                    text-sm
                    font-bold
                    tracking-wider
                    text-[#D4AF37]
                  ">
                    MSJ
                  </span>
                </div>
              </div>

              <h2 className="
                text-lg
                font-semibold
                text-[#F8F9FA]
              ">
                No Upcoming Events
              </h2>

              <p className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                text-[#F8F9FA]/55
              ">
                There are no calendar events scheduled for
                this batch yet.
              </p>
            </motion.div>
          )}

        {batchId &&
          !loading &&
          !error &&
          events.length > 0 && (
            <div className="
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            ">
              {events.map((event, index) => {
                const date = new Date(event.date);

                return (
                  <motion.article
                    key={event._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.06,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border border-[#D4AF37]/25
                      bg-[rgba(10,35,26,0.75)]
                      p-5
                      backdrop-blur-[16px]
                      transition-shadow
                      hover:border-[#D4AF37]/50
                      hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]
                    "
                  >
                    <div className="
                      absolute
                      top-0
                      left-0
                      right-0
                      h-px
                      bg-gradient-to-r
                      from-transparent
                      via-[#D4AF37]/70
                      to-transparent
                    " />

                    <div className="
                      flex
                      items-center
                      gap-4
                    ">
                      <div className="
                        flex
                        h-16
                        w-16
                        shrink-0
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        border border-[#D4AF37]/30
                        bg-[#D4AF37]/10
                      ">
                        <span className="
                          text-[10px]
                          uppercase
                          tracking-wider
                          text-[#F8F9FA]/50
                        ">
                          {date.toLocaleDateString(
                            'en-US',
                            { month: 'short' }
                          )}
                        </span>

                        <span className="
                          text-2xl
                          font-bold
                          text-[#D4AF37]
                        ">
                          {date.getDate()}
                        </span>
                      </div>

                      <div>
                        <p className="
                          text-xs
                          font-medium
                          text-[#10B981]
                        ">
                          {date.toLocaleDateString(
                            'en-US',
                            { weekday: 'long' }
                          )}
                        </p>

                        <p className="
                          mt-1
                          text-xs
                          text-[#F8F9FA]/45
                        ">
                          {date.toLocaleDateString(
                            'en-US',
                            { year: 'numeric' }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="
                      mt-5
                      border-t
                      border-[#F8F9FA]/10
                      pt-5
                    ">
                      <h2 className="
                        text-lg
                        font-semibold
                        text-[#F8F9FA]
                      ">
                        {event.title}
                      </h2>

                      {event.description && (
                        <p className="
                          mt-2
                          line-clamp-3
                          text-sm
                          leading-6
                          text-[#F8F9FA]/55
                        ">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-5">
                        <span className="
                          rounded-full
                          border border-[#10B981]/25
                          bg-[#10B981]/10
                          px-3 py-1
                          text-xs
                          font-medium
                          text-[#10B981]
                        ">
                          Upcoming
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

      </div>
    </div>
  );
}