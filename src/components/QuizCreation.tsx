// 'use client';

// import React from 'react';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from './ui/card';
// import { useForm } from 'react-hook-form';
// import { quizCreationSchema } from '@/schemas/form/quiz';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Button } from './ui/button';
// import { BookOpen, CopyCheck } from 'lucide-react';
// import { Separator } from './ui/separator';
// import { useMutation } from '@tanstack/react-query';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import LoadingQuestions from './LoadingQuestions';

// type Props = {
//   topicParam: string;
// };

// type Input = z.infer<typeof quizCreationSchema>;

// const QuizCreation = ({ topicParam }: Props) => {
//   const router = useRouter();
//   const [showLoader, setShowLoader] = React.useState(false);
//   const [finishedLoading, setFinishedLoading] = React.useState(false);
//   const { mutate: getQuestions, isLoading } = useMutation({
//     mutationFn: async ({ amount, topic, type }: Input) => {
//       const response = await axios.post('/api/game', {
//         amount,
//         topic,
//         type,
//       });
//       return response.data;
//     },
//   });

//   const form = useForm<Input>({
//     resolver: zodResolver(quizCreationSchema),
//     defaultValues: {
//       topic: topicParam,
//       type: 'open_ended',
//       amount: 3,
//     },
//   });

//   function onSubmit(input: Input) {
//     setShowLoader(true);
//     getQuestions(
//       {
//         amount: input.amount,
//         topic: input.topic,
//         type: input.type,
//       },
//       {
//         onSuccess: ({ gameId }) => {
//           setFinishedLoading(true);
//           setTimeout(() => {
//             if (form.getValues('type') == 'open_ended') {
//               router.push(`/play/open_ended/${gameId}`);
//             } else {
//               router.push(`/play/mcq/${gameId}`);
//             }
//           }, 1000);
//         },
//         onError: () => {
//           setShowLoader(false);
//         },
//       },
//     );
//   }

//   form.watch();
//   if (showLoader) {
//     return <LoadingQuestions finished={finishedLoading} />;
//   }

//   return (
//     <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
//       <Card>
//         <CardHeader>
//           <CardTitle className="font-bold text-2xl">Quiz Creation</CardTitle>
//           <CardDescription>Choose a topic</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <FormField
//                 control={form.control}
//                 name="topic"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Topic</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter a topic..." {...field} />
//                     </FormControl>
//                     <FormDescription>Please provide a topic</FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="amount"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Number of Questions</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter a amount..."
//                         {...field}
//                         type="number"
//                         min={1}
//                         max={10}
//                         onChange={(e) => {
//                           form.setValue('amount', parseInt(e.target.value));
//                         }}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex justify-between">
//                 <Button
//                   type="button"
//                   variant={
//                     form.getValues('type') === 'mcq' ? 'default' : 'secondary'
//                   }
//                   onClick={() => form.setValue('type', 'mcq')}
//                   className="w-1/2 rounded-none rounded-l-lg">
//                   <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
//                 </Button>
//                 <Separator orientation="vertical" />
//                 <Button
//                   type="button"
//                   variant={
//                     form.getValues('type') === 'open_ended'
//                       ? 'default'
//                       : 'secondary'
//                   }
//                   onClick={() => form.setValue('type', 'open_ended')}
//                   className="w-1/2 rounded-none rounded-r-lg">
//                   <BookOpen className="w-4 h-4 mr-2" /> Open Ended
//                 </Button>
//               </div>
//               <Button disabled={isLoading} type="submit">
//                 Submit
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default QuizCreation;

'use client';
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { BookOpen, CopyCheck } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { quizCreationSchema } from '@/schemas/form/quiz';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import LoadingQuestions from './LoadingQuestions';

type Props = {
  topic: string;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topic: topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);
  const { toast } = useToast();
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post('/api/game', { amount, topic, type });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      type: 'mcq',
      amount: 3,
    },
  });

  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions(data, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast({
              title: 'Error',
              description: 'Something went wrong. Please try again later.',
              variant: 'destructive',
            });
          }
        }
      },
      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues('type') === 'mcq') {
            router.push(`/play/mcq/${gameId}`);
          } else if (form.getValues('type') === 'open_ended') {
            router.push(`/play/open-ended/${gameId}`);
          }
        }, 2000);
      },
    });
  };
  form.watch();

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please provide any topic you would like to be quizzed on
                      here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How many questions?"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue('amount', parseInt(e.target.value));
                        }}
                        min={1}
                        max={10}
                      />
                    </FormControl>
                    <FormDescription>
                      You can choose how many questions you would like to be
                      quizzed on here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  variant={
                    form.getValues('type') === 'mcq' ? 'default' : 'secondary'
                  }
                  className="w-1/2 rounded-none rounded-l-lg"
                  onClick={() => {
                    form.setValue('type', 'mcq');
                  }}
                  type="button">
                  <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                </Button>
                <Separator />
                <Button
                  variant={
                    form.getValues('type') === 'open_ended'
                      ? 'default'
                      : 'secondary'
                  }
                  className="w-1/2 rounded-none rounded-r-lg"
                  onClick={() => form.setValue('type', 'open_ended')}
                  type="button">
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
