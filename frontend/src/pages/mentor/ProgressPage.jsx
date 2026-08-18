import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function ProgressPage() {
  const { user } = useAuth();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(Boolean(user?.id));
  const [error, setError] = useState('');

  // Load student progress from the backend.
  useEffect(() => {
    if (!user?.id) return;

    async function loadProgress() {
      try {
        setLoading(true);
        setError('');

        const response = await axiosInstance.get('/progress', {
          params: {
            studentId: user.id,
          },
        });

        setTopics(response?.data?.data || []);
      } catch (error) {
        console.error('Failed to load progress:', error);

        setError(
          error?.response?.data?.message ||
            'Could not load your progress.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [user?.id]);

  const averageProgress =
    topics.length > 0
      ? Math.round(
          topics.reduce(
            (total, topic) =>
              total + Number(topic.progress || 0),
            0
          ) / topics.length
        )
      : 0;

  const completedTopics = topics.filter(
    (topic) => Number(topic.progress || 0) >= 100
  ).length;

  return (
    <div className="
      min-h-screen
      bg-[#051C14]
      px-4 py-6
      sm:px-6
      lg:px-8
    ">
      <div className="mx-auto max-w-7xl">

        {/* MSJ Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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
                My Progress
              </h1>

              <p className="
                mt-1
                text-sm
                text-[#F8F9FA]/55
              ">
                Track your bootcamp learning progress
              </p>
            </div>

          </div>
        </motion.header>

        {!user?.id && (
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
              Student Account Required
            </h2>

            <p className="
              mt-2
              text-sm
              text-[#F8F9FA]/55
            ">
              Please log in to view your progress.
            </p>
          </div>
        )}

        {user?.id && loading && (
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
              Loading your progress...
            </p>
          </div>
        )}

        {user?.id && !loading && error && (
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

        {user?.id &&
          !loading &&
          !error && (
            <>
              <div className="
                mb-6
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
              ">

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border border-[#D4AF37]/30
                    bg-[rgba(10,35,26,0.75)]
                    p-6
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

                  <p className="
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    text-[#D4AF37]
                  ">
                    Overall Progress
                  </p>

                  <div className="
                    mt-3
                    flex
                    items-end
                    gap-2
                  ">
                    <span className="
                      text-5xl
                      font-bold
                      text-[#D4AF37]
                    ">
                      {averageProgress}
                    </span>

                    <span className="
                      mb-1
                      text-2xl
                      font-semibold
                      text-[#F8F9FA]/40
                    ">
                      %
                    </span>
                  </div>

                  <div className="
                    mt-5
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-[#0A0F0D]
                  ">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${averageProgress}%`,
                      }}
                      transition={{ duration: 0.8 }}
                      className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-[#D4AF37]
                        to-[#10B981]
                      "
                    />
                  </div>

                  <p className="
                    mt-3
                    text-sm
                    text-[#F8F9FA]/50
                  ">
                    Your average topic completion
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.08,
                  }}
                  className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border border-[#10B981]/25
                    bg-[rgba(10,35,26,0.75)]
                    p-6
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
                    via-[#10B981]
                    to-transparent
                  " />

                  <p className="
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    text-[#10B981]
                  ">
                    Completed Topics
                  </p>

                  <div className="
                    mt-3
                    text-5xl
                    font-bold
                    text-[#F8F9FA]
                  ">
                    {completedTopics}
                  </div>

                  <p className="
                    mt-3
                    text-sm
                    text-[#F8F9FA]/50
                  ">
                    Topics completed at 100%
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.16,
                  }}
                  className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border border-[#D4AF37]/20
                    bg-[rgba(10,35,26,0.75)]
                    p-6
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
                    via-[#D4AF37]/70
                    to-transparent
                  " />

                  <p className="
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    text-[#D4AF37]
                  ">
                    Total Topics
                  </p>

                  <div className="
                    mt-3
                    text-5xl
                    font-bold
                    text-[#F8F9FA]
                  ">
                    {topics.length}
                  </div>

                  <p className="
                    mt-3
                    text-sm
                    text-[#F8F9FA]/50
                  ">
                    Topics currently tracked
                  </p>
                </motion.div>

              </div>

              {topics.length === 0 ? (
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
                    No Progress Yet
                  </h2>

                  <p className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-sm
                    text-[#F8F9FA]/55
                  ">
                    Your learning progress will appear here
                    once topics have been added.
                  </p>
                </motion.div>
              ) : (
                <motion.section
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                  }}
                  className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border border-[#D4AF37]/30
                    bg-[rgba(10,35,26,0.75)]
                    p-6
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
                    mb-6
                    flex
                    items-center
                    justify-between
                  ">
                    <div>
                      <p className="
                        text-xs
                        uppercase
                        tracking-[0.2em]
                        text-[#D4AF37]
                      ">
                        Learning Journey
                      </p>

                      <h2 className="
                        mt-1
                        text-xl
                        font-semibold
                        text-[#F8F9FA]
                      ">
                        Topic Progress
                      </h2>
                    </div>

                    <span className="
                      rounded-full
                      border border-[#10B981]/25
                      bg-[#10B981]/10
                      px-3 py-1
                      text-xs
                      font-medium
                      text-[#10B981]
                    ">
                      {topics.length} Topics
                    </span>
                  </div>

                  <div className="space-y-6">
                    {topics.map((topic, index) => {
                      const progress = Math.min(
                        Math.max(
                          Number(topic.progress) || 0,
                          0
                        ),
                        100
                      );

                      return (
                        <motion.div
                          key={topic._id || index}
                          initial={{
                            opacity: 0,
                            x: -10,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                          }}
                        >
                          <div className="
                            mb-2
                            flex
                            items-center
                            justify-between
                            gap-4
                          ">
                            <span className="
                              text-sm
                              font-medium
                              text-[#F8F9FA]
                            ">
                              {topic.topic}
                            </span>

                            <span className="
                              shrink-0
                              text-sm
                              font-semibold
                              text-[#D4AF37]
                            ">
                              {progress}%
                            </span>
                          </div>

                          <div className="
                            h-2.5
                            overflow-hidden
                            rounded-full
                            bg-[#0A0F0D]
                          ">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${progress}%`,
                              }}
                              transition={{
                                duration: 0.7,
                                delay: index * 0.05,
                              }}
                              className="
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                from-[#D4AF37]
                                to-[#10B981]
                              "
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </>
          )}

      </div>
    </div>
  );
}