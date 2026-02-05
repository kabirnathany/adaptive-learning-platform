/**
 * Real questions and learning materials for K-12 Math, English, and Science.
 * Each entry is { topicName, topicDescription, questions: [{ text, options, correctIndex, explanation?, difficulty }], material: { title, content } }.
 * gradeLevel is applied when seeding (K, 1, 2, ... 12).
 */
const GRADE_LEVELS = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const MATH_TOPICS = {
  K: {
    topicName: 'Counting and Numbers to 10',
    topicDescription: 'Learn to count objects and recognize numbers 0–10.',
    questions: [
      { text: 'How many apples are there? 🍎🍎🍎', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'There are 3 apples.', difficulty: 'easy' },
      { text: 'Count the stars: ⭐⭐⭐⭐⭐', options: ['4', '5', '6', '7'], correctIndex: 1, explanation: 'There are 5 stars.', difficulty: 'easy' },
      { text: 'Which number comes after 7?', options: ['6', '7', '8', '9'], correctIndex: 2, explanation: '8 comes right after 7.', difficulty: 'easy' },
      { text: 'How many circles? ⭕⭕', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: 'There are 2 circles.', difficulty: 'easy' },
      { text: 'What is 1 + 1?', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: 'One plus one equals two.', difficulty: 'easy' },
    ],
    material: {
      title: 'Counting and Numbers to 10',
      content: 'Numbers help us count how many things we have. Start by counting objects you see every day: toys, fingers, steps. Practice saying the number names in order: one, two, three, four, five, six, seven, eight, nine, ten. Use your fingers to show each number. When you see a written number (like 3), say it out loud and show that many objects.',
    },
  },
  1: {
    topicName: 'Addition and Subtraction within 20',
    topicDescription: 'Add and subtract numbers up to 20.',
    questions: [
      { text: 'What is 5 + 3?', options: ['6', '7', '8', '9'], correctIndex: 2, explanation: '5 + 3 = 8.', difficulty: 'easy' },
      { text: 'What is 10 + 7?', options: ['15', '16', '17', '18'], correctIndex: 2, explanation: '10 + 7 = 17.', difficulty: 'easy' },
      { text: 'What is 12 − 5?', options: ['5', '6', '7', '8'], correctIndex: 2, explanation: '12 − 5 = 7.', difficulty: 'medium' },
      { text: 'What is 9 + 4?', options: ['12', '13', '14', '15'], correctIndex: 1, explanation: '9 + 4 = 13.', difficulty: 'medium' },
      { text: 'What is 18 − 9?', options: ['7', '8', '9', '10'], correctIndex: 2, explanation: '18 − 9 = 9.', difficulty: 'medium' },
    ],
    material: {
      title: 'Addition and Subtraction within 20',
      content: 'Addition means putting groups together. Subtraction means taking away. Use a number line or counters to see what happens. For example, 7 + 5: start at 7 and count up 5 more to get 12. For 14 − 6, start at 14 and count back 6 to get 8. Practice with real objects (blocks, buttons) to build a strong understanding.',
    },
  },
  2: {
    topicName: 'Place Value and Two-Digit Numbers',
    topicDescription: 'Understand tens and ones in numbers up to 100.',
    questions: [
      { text: 'How many tens are in the number 50?', options: ['0', '5', '50', '10'], correctIndex: 1, explanation: '50 has 5 tens (5 × 10 = 50).', difficulty: 'easy' },
      { text: 'What number is 3 tens and 4 ones?', options: ['34', '43', '7', '12'], correctIndex: 0, explanation: '3 tens = 30, 4 ones = 4, so 30 + 4 = 34.', difficulty: 'easy' },
      { text: 'Which number is greater: 67 or 76?', options: ['67', '76', 'They are equal', 'Cannot tell'], correctIndex: 1, explanation: '76 is greater because 7 tens is more than 6 tens.', difficulty: 'medium' },
      { text: 'What is 20 + 15?', options: ['25', '35', '30', '45'], correctIndex: 1, explanation: '20 + 15 = 35.', difficulty: 'easy' },
      { text: 'How many ones are in 82?', options: ['2', '8', '80', '82'], correctIndex: 0, explanation: 'The digit in the ones place is 2.', difficulty: 'easy' },
    ],
    material: {
      title: 'Place Value: Tens and Ones',
      content: 'Every two-digit number has a tens place and a ones place. In 36, the 3 means 3 tens (30) and the 6 means 6 ones (6). So 36 = 30 + 6. Use base-ten blocks or drawings: one long = 10, one small cube = 1. Building numbers with blocks helps you see how place value works.',
    },
  },
  3: {
    topicName: 'Multiplication and Division Basics',
    topicDescription: 'Multiply and divide within 100 using groups and arrays.',
    questions: [
      { text: 'What is 3 × 4?', options: ['7', '10', '12', '14'], correctIndex: 2, explanation: '3 × 4 = 12 (3 groups of 4).', difficulty: 'easy' },
      { text: 'What is 5 × 6?', options: ['25', '30', '35', '36'], correctIndex: 1, explanation: '5 × 6 = 30.', difficulty: 'easy' },
      { text: 'What is 24 ÷ 4?', options: ['4', '5', '6', '8'], correctIndex: 2, explanation: '24 ÷ 4 = 6 because 4 × 6 = 24.', difficulty: 'medium' },
      { text: 'What is 7 × 3?', options: ['10', '21', '24', '28'], correctIndex: 1, explanation: '7 × 3 = 21.', difficulty: 'easy' },
      { text: 'If 18 ÷ 3 = 6, what is 6 × 3?', options: ['9', '18', '21', '24'], correctIndex: 1, explanation: 'Division and multiplication are related: 6 × 3 = 18.', difficulty: 'medium' },
    ],
    material: {
      title: 'Multiplication and Division Basics',
      content: 'Multiplication is repeated addition: 4 × 3 means 4 + 4 + 4 = 12. Division is splitting into equal groups: 12 ÷ 3 means "how many groups of 3 make 12?" The answer is 4. Use arrays (rows and columns of dots) to see both: 3 rows of 4 is 3 × 4 = 12. Memorizing basic facts (like 5 × 5 = 25) will help you solve problems faster.',
    },
  },
  4: {
    topicName: 'Fractions: Parts of a Whole',
    topicDescription: 'Understand fractions as parts of a whole and on a number line.',
    questions: [
      { text: 'What fraction of the circle is shaded if half is shaded?', options: ['1/4', '1/2', '1/3', '3/4'], correctIndex: 1, explanation: 'Half of a whole is 1/2.', difficulty: 'easy' },
      { text: 'Which is greater: 1/3 or 1/2?', options: ['1/3', '1/2', 'Equal', 'Cannot compare'], correctIndex: 1, explanation: '1/2 is larger; when you split into 2 parts each part is bigger than when you split into 3.', difficulty: 'medium' },
      { text: 'What is 1/4 + 1/4?', options: ['1/8', '1/4', '1/2', '2/4 only'], correctIndex: 2, explanation: '1/4 + 1/4 = 2/4 = 1/2.', difficulty: 'easy' },
      { text: 'How do you read the fraction 3/5?', options: ['Three fifths', 'Five thirds', 'Three over five', 'All are correct'], correctIndex: 0, explanation: '3/5 is read "three fifths" (3 parts out of 5 equal parts).', difficulty: 'easy' },
      { text: 'Which fraction equals 1/2?', options: ['2/3', '2/4', '3/4', '1/4'], correctIndex: 1, explanation: '2/4 = 1/2 (both represent half).', difficulty: 'medium' },
    ],
    material: {
      title: 'Fractions: Parts of a Whole',
      content: 'A fraction has a numerator (top) and denominator (bottom). The denominator tells how many equal parts the whole is split into; the numerator tells how many of those parts you have. So 3/4 means 3 out of 4 equal parts. Draw pictures and use number lines to compare fractions. Equivalent fractions represent the same amount: 1/2 = 2/4 = 3/6.',
    },
  },
  5: {
    topicName: 'Decimals and Place Value',
    topicDescription: 'Read, write, and compare decimals to hundredths.',
    questions: [
      { text: 'What is 0.5 + 0.3?', options: ['0.8', '0.15', '0.53', '0.2'], correctIndex: 0, explanation: '0.5 + 0.3 = 0.8.', difficulty: 'easy' },
      { text: 'Which is greater: 0.7 or 0.69?', options: ['0.69', '0.7', 'Equal', 'Cannot tell'], correctIndex: 1, explanation: '0.7 = 0.70, which is greater than 0.69.', difficulty: 'medium' },
      { text: 'What is 0.25 as a fraction in simplest form?', options: ['2/5', '1/4', '25/100', '1/25'], correctIndex: 1, explanation: '0.25 = 25/100 = 1/4.', difficulty: 'medium' },
      { text: 'What digit is in the tenths place in 4.71?', options: ['4', '7', '1', '71'], correctIndex: 1, explanation: 'The tenths place is the first digit to the right of the decimal: 7.', difficulty: 'easy' },
      { text: 'What is 1.2 − 0.5?', options: ['0.7', '0.6', '1.0', '1.7'], correctIndex: 0, explanation: '1.2 − 0.5 = 0.7.', difficulty: 'medium' },
    ],
    material: {
      title: 'Decimals and Place Value',
      content: 'Decimals extend place value to the right of the ones place: tenths, hundredths, thousandths. The first digit after the decimal is tenths (e.g., 0.3 = 3/10), the second is hundredths (0.25 = 25/100 = 1/4). Use a number line and money (dollars and cents) to practice. Comparing decimals: compare tenths first, then hundredths if needed.',
    },
  },
  6: {
    topicName: 'Ratios and Proportional Relationships',
    topicDescription: 'Understand ratios and use them to solve problems.',
    questions: [
      { text: 'In a class of 20 students, 12 are girls. What is the ratio of girls to boys?', options: ['12:20', '12:8', '8:12', '20:12'], correctIndex: 1, explanation: 'Girls = 12, boys = 8, so ratio girls to boys = 12:8.', difficulty: 'medium' },
      { text: 'If 2 pens cost $6, how much do 4 pens cost (same price per pen)?', options: ['$8', '$10', '$12', '$24'], correctIndex: 2, explanation: '4 pens is 2 times 2 pens, so 2 × $6 = $12.', difficulty: 'easy' },
      { text: 'Which ratio is equivalent to 3:4?', options: ['6:8', '4:3', '9:12', '6:8 and 9:12'], correctIndex: 3, explanation: '3:4 = 6:8 = 9:12 (multiply both parts by the same number).', difficulty: 'medium' },
      { text: 'A recipe uses 2 cups flour and 1 cup sugar. What is the ratio of flour to sugar?', options: ['1:2', '2:1', '2:3', '3:2'], correctIndex: 1, explanation: 'Flour to sugar = 2:1.', difficulty: 'easy' },
      { text: 'If 5 miles ≈ 8 km, about how many km is 10 miles?', options: ['13', '16', '18', '20'], correctIndex: 1, explanation: '10 miles is 2 × 5 miles, so 2 × 8 km = 16 km.', difficulty: 'medium' },
    ],
    material: {
      title: 'Ratios and Proportional Relationships',
      content: 'A ratio compares two quantities (e.g., 3 cups flour to 2 cups sugar). Equivalent ratios can be found by multiplying or dividing both parts by the same number. A proportion is an equation that two ratios are equal (e.g., 3/4 = 6/8). Use unit rates (e.g., cost per item) to compare and solve real-world problems.',
    },
  },
  7: {
    topicName: 'Expressions and Equations',
    topicDescription: 'Write and evaluate expressions; solve one-step equations.',
    questions: [
      { text: "If x = 5, what is 2x + 3?", options: ['10', '13', '16', '11'], correctIndex: 1, explanation: '2(5) + 3 = 10 + 3 = 13.', difficulty: 'easy' },
      { text: 'Solve: n + 7 = 15', options: ['n = 8', 'n = 22', 'n = 9', 'n = 7'], correctIndex: 0, explanation: 'n = 15 − 7 = 8.', difficulty: 'easy' },
      { text: 'What is 4 more than twice a number if the number is 6?', options: ['10', '14', '16', '12'], correctIndex: 2, explanation: 'Twice 6 is 12; 12 + 4 = 16.', difficulty: 'medium' },
      { text: 'Solve: 3m = 18', options: ['m = 6', 'm = 15', 'm = 21', 'm = 54'], correctIndex: 0, explanation: 'm = 18 ÷ 3 = 6.', difficulty: 'easy' },
      { text: 'Simplify: 2a + 5a', options: ['7a', '10a', '7a²', '2a + 5a'], correctIndex: 0, explanation: '2a + 5a = 7a (combine like terms).', difficulty: 'easy' },
    ],
    material: {
      title: 'Expressions and Equations',
      content: 'An expression is a phrase that can include numbers, variables, and operations (e.g., 2x + 5). To evaluate, replace the variable with a number and compute. An equation has an equals sign; solving means finding the value of the variable that makes it true. Do the same operation on both sides to keep the equation balanced (e.g., subtract 5 from both sides of x + 5 = 12 to get x = 7).',
    },
  },
  8: {
    topicName: 'Geometry: Area and Volume',
    topicDescription: 'Find area of triangles and quadrilaterals; volume of rectangular prisms.',
    questions: [
      { text: 'What is the area of a rectangle that is 6 cm long and 4 cm wide?', options: ['10 cm²', '24 cm²', '20 cm²', '12 cm²'], correctIndex: 1, explanation: 'Area = length × width = 6 × 4 = 24 cm².', difficulty: 'easy' },
      { text: 'What is the area of a triangle with base 10 and height 4?', options: ['14', '20', '40', '5'], correctIndex: 1, explanation: 'Area of triangle = (1/2) × base × height = (1/2)(10)(4) = 20.', difficulty: 'medium' },
      { text: 'What is the volume of a box that is 3 m by 4 m by 5 m?', options: ['12 m³', '60 m³', '15 m³', '47 m³'], correctIndex: 1, explanation: 'Volume = length × width × height = 3 × 4 × 5 = 60 m³.', difficulty: 'easy' },
      { text: 'How many faces does a rectangular prism have?', options: ['4', '6', '8', '12'], correctIndex: 1, explanation: 'A rectangular prism has 6 faces (like a box).', difficulty: 'easy' },
      { text: 'The area of a square is 49 square units. What is the side length?', options: ['6', '7', '8', '9'], correctIndex: 1, explanation: 'Side × side = 49, so side = √49 = 7.', difficulty: 'medium' },
    ],
    material: {
      title: 'Geometry: Area and Volume',
      content: 'Area is the amount of space inside a 2D shape. Rectangle: A = length × width. Triangle: A = (1/2) × base × height. Volume is the amount of space inside a 3D shape. For a rectangular prism, V = length × width × height. Always use the same units (e.g., cm) and write area in square units (cm²) and volume in cubic units (cm³).',
    },
  },
  9: {
    topicName: 'Linear Equations and Inequalities',
    topicDescription: 'Solve linear equations and inequalities in one variable.',
    questions: [
      { text: 'Solve: 2x − 5 = 11', options: ['x = 3', 'x = 8', 'x = 6', 'x = 13'], correctIndex: 1, explanation: '2x = 16, so x = 8.', difficulty: 'medium' },
      { text: 'Which value of x satisfies x + 3 > 7?', options: ['4', '5', '3', '7'], correctIndex: 1, explanation: 'x must be greater than 4; 5 > 4.', difficulty: 'easy' },
      { text: 'Solve: −3y = 12', options: ['y = 4', 'y = −4', 'y = 9', 'y = −9'], correctIndex: 1, explanation: 'y = 12 ÷ (−3) = −4.', difficulty: 'medium' },
      { text: 'Solve: 4(x − 2) = 20', options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'], correctIndex: 2, explanation: 'x − 2 = 5, so x = 7.', difficulty: 'medium' },
      { text: 'If 5 − 2n ≥ 1, what is the largest integer value of n?', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: '5 − 2n ≥ 1 → −2n ≥ −4 → n ≤ 2, so max integer is 2.', difficulty: 'hard' },
    ],
    material: {
      title: 'Linear Equations and Inequalities',
      content: 'To solve a linear equation, isolate the variable by doing the same operation on both sides. For inequalities (<, >, ≤, ≥), the same rules apply except when you multiply or divide by a negative number—then reverse the inequality. Check your answer by substituting back into the original equation or inequality.',
    },
  },
  10: {
    topicName: 'Quadratic Expressions and Equations',
    topicDescription: 'Factor quadratics and solve quadratic equations.',
    questions: [
      { text: 'Factor: x² + 5x + 6', options: ['(x+2)(x+3)', '(x+1)(x+6)', '(x+2)(x+4)', 'Cannot factor'], correctIndex: 0, explanation: 'x² + 5x + 6 = (x + 2)(x + 3) because 2+3=5 and 2×3=6.', difficulty: 'medium' },
      { text: 'What are the solutions of x² − 9 = 0?', options: ['x = 3 only', 'x = −3 only', 'x = 3 and x = −3', 'x = 9'], correctIndex: 2, explanation: 'x² = 9, so x = 3 or x = −3.', difficulty: 'medium' },
      { text: 'Expand: (x + 4)(x − 2)', options: ['x² + 2x − 8', 'x² − 2x − 8', 'x² + 6x − 8', 'x² − 6x + 8'], correctIndex: 0, explanation: '(x+4)(x−2) = x² − 2x + 4x − 8 = x² + 2x − 8.', difficulty: 'medium' },
      { text: 'For y = x² − 4, what is y when x = 3?', options: ['5', '−5', '7', '−7'], correctIndex: 0, explanation: 'y = 9 − 4 = 5.', difficulty: 'easy' },
      { text: 'Which is a root of x² − 5x + 6 = 0?', options: ['1', '2', '4', '5'], correctIndex: 1, explanation: 'x² − 5x + 6 = (x−2)(x−3); roots are 2 and 3.', difficulty: 'medium' },
    ],
    material: {
      title: 'Quadratic Expressions and Equations',
      content: 'A quadratic has the form ax² + bx + c. Factoring writes it as a product of two binomials. To solve x² + bx + c = 0, find two numbers that add to b and multiply to c. The zero product property: if A × B = 0, then A = 0 or B = 0. So set each factor equal to 0 to find the roots. The quadratic formula can solve any quadratic when factoring is difficult.',
    },
  },
  11: {
    topicName: 'Functions and Graphs',
    topicDescription: 'Understand functions, domain, range, and linear graphs.',
    questions: [
      { text: 'In the function f(x) = 2x + 1, what is f(3)?', options: ['5', '6', '7', '8'], correctIndex: 2, explanation: 'f(3) = 2(3) + 1 = 7.', difficulty: 'easy' },
      { text: 'What is the slope of the line y = −4x + 7?', options: ['4', '−4', '7', '−7'], correctIndex: 1, explanation: 'In y = mx + b, the slope m is −4.', difficulty: 'easy' },
      { text: 'Which point lies on the line y = 2x − 1?', options: ['(0, 0)', '(1, 1)', '(2, 3)', '(3, 5)'], correctIndex: 2, explanation: 'When x = 2, y = 2(2) − 1 = 3.', difficulty: 'medium' },
      { text: 'What is the y-intercept of y = 5x − 3?', options: ['5', '−3', '3', '−5'], correctIndex: 1, explanation: 'The y-intercept is the constant term: −3.', difficulty: 'easy' },
      { text: 'Two lines are parallel if their slopes are:', options: ['negative reciprocals', 'equal', 'zero', 'undefined'], correctIndex: 1, explanation: 'Parallel lines have the same slope.', difficulty: 'medium' },
    ],
    material: {
      title: 'Functions and Graphs',
      content: 'A function assigns exactly one output to each input. Notation: f(x) = 2x means "double the input." The graph of a linear function is a line: y = mx + b, where m is the slope (rise over run) and b is the y-intercept. Domain = possible inputs; range = possible outputs. Slope tells how steep the line is; positive slope goes up, negative goes down.',
    },
  },
  12: {
    topicName: 'Statistics and Probability',
    topicDescription: 'Interpret data, standard deviation, and basic probability.',
    questions: [
      { text: 'What is the mean of 4, 8, 6, and 10?', options: ['6', '7', '8', '9'], correctIndex: 1, explanation: 'Mean = (4+8+6+10)/4 = 28/4 = 7.', difficulty: 'easy' },
      { text: 'In a bag of 3 red and 5 blue marbles, what is P(picking red)?', options: ['3/5', '3/8', '5/8', '1/3'], correctIndex: 1, explanation: 'P(red) = number of red / total = 3/8.', difficulty: 'easy' },
      { text: 'What is the median of 2, 5, 7, 8, 12?', options: ['5', '6', '7', '8'], correctIndex: 2, explanation: 'The middle value of the ordered list is 7.', difficulty: 'easy' },
      { text: 'If events A and B are independent, P(A and B) =', options: ['P(A) + P(B)', 'P(A) × P(B)', 'P(A) − P(B)', 'P(A) / P(B)'], correctIndex: 1, explanation: 'For independent events, multiply the probabilities.', difficulty: 'medium' },
      { text: 'What does a high standard deviation indicate?', options: ['Data are close to the mean', 'Data are spread out', 'Sample size is large', 'Mean is zero'], correctIndex: 1, explanation: 'High standard deviation means values are spread out from the mean.', difficulty: 'medium' },
    ],
    material: {
      title: 'Statistics and Probability',
      content: 'Mean (average), median (middle value), and mode (most frequent) summarize data. Standard deviation measures spread. Probability = favorable outcomes / total outcomes (when outcomes are equally likely). For independent events, P(A and B) = P(A) × P(B). Use tree diagrams or lists to count outcomes for compound events.',
    },
  },
};

const ENGLISH_TOPICS = {
  K: {
    topicName: 'Letters and Sounds',
    topicDescription: 'Recognize letters and their sounds.',
    questions: [
      { text: 'Which letter makes the sound at the start of "apple"?', options: ['B', 'A', 'C', 'D'], correctIndex: 1, explanation: 'Apple starts with the letter A.', difficulty: 'easy' },
      { text: 'How many letters are in the word "cat"?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'C-A-T has 3 letters.', difficulty: 'easy' },
      { text: 'Which two words rhyme: cat, dog, hat?', options: ['cat and dog', 'cat and hat', 'dog and hat', 'none'], correctIndex: 1, explanation: 'Cat and hat rhyme (same ending sound).', difficulty: 'easy' },
      { text: 'What is the first letter of "ball"?', options: ['A', 'L', 'B', 'P'], correctIndex: 2, explanation: 'Ball starts with B.', difficulty: 'easy' },
      { text: 'Which letter is a vowel?', options: ['B', 'T', 'E', 'K'], correctIndex: 2, explanation: 'The vowels are A, E, I, O, U.', difficulty: 'easy' },
    ],
    material: {
      title: 'Letters and Sounds',
      content: 'Letters are the building blocks of words. Each letter has a name (e.g., "bee" for B) and often one or more sounds. Vowels are A, E, I, O, U; the other letters are consonants. Practice saying the sound at the start of words (e.g., /s/ for sun) and notice when words rhyme—they share the same ending sound. Reading aloud and pointing to each word helps connect letters to sounds.',
    },
  },
  1: {
    topicName: 'Sight Words and Simple Sentences',
    topicDescription: 'Read common sight words and short sentences.',
    questions: [
      { text: 'Which word is spelled correctly?', options: ['teh', 'the', 'hte', 'eht'], correctIndex: 1, explanation: '"The" is spelled T-H-E.', difficulty: 'easy' },
      { text: 'What punctuation ends a question?', options: ['.', '?', '!', ','], correctIndex: 1, explanation: 'A question mark (?) ends a question.', difficulty: 'easy' },
      { text: 'Which word fits: "I ___ to school."', options: ['go', 'goes', 'going', 'went'], correctIndex: 0, explanation: 'I go to school (present tense).', difficulty: 'easy' },
      { text: 'What is the noun in "The dog runs."?', options: ['The', 'dog', 'runs', 'runs and dog'], correctIndex: 1, explanation: 'A noun is a person, place, or thing; "dog" is the thing.', difficulty: 'medium' },
      { text: 'Which is a complete sentence?', options: ['Runs fast.', 'The cat sleeps.', 'Big red.', 'On the table.'], correctIndex: 1, explanation: 'A sentence has a subject (the cat) and a verb (sleeps).', difficulty: 'medium' },
    ],
    material: {
      title: 'Sight Words and Simple Sentences',
      content: 'Sight words are common words we learn to recognize by sight (e.g., the, and, is, to). A sentence is a complete thought: it usually has a subject (who or what) and a predicate (what they do). Start sentences with a capital letter and end with a period, question mark, or exclamation point. Read simple sentences aloud and notice how words work together.',
    },
  },
  2: {
    topicName: 'Reading Comprehension: Main Idea',
    topicDescription: 'Identify the main idea and key details in short texts.',
    questions: [
      { text: 'What is the "main idea" of a paragraph?', options: ['The first sentence', 'The most important point', 'The longest sentence', 'The last word'], correctIndex: 1, explanation: 'The main idea is what the paragraph is mostly about.', difficulty: 'easy' },
      { text: 'Details in a story usually:', options: ['repeat the title', 'support the main idea', 'are unrelated', 'are the same in every story'], correctIndex: 1, explanation: 'Details give more information about the main idea.', difficulty: 'easy' },
      { text: 'If a paragraph is about how to make a sandwich, the main idea might be:', options: ['Sandwiches are tasty', 'Steps to make a sandwich', 'Bread is soft', 'Lunch is at noon'], correctIndex: 1, explanation: 'The main idea summarizes the topic of the paragraph.', difficulty: 'medium' },
      { text: 'Where might the main idea sometimes appear?', options: ['Only at the end', 'In the first or last sentence', 'Never in the paragraph', 'Only in the title'], correctIndex: 1, explanation: 'Writers often state the main idea at the start or end.', difficulty: 'medium' },
      { text: 'What do we use to find the main idea?', options: ['Only the title', 'Key details and the overall message', 'Just the first word', 'The number of sentences'], correctIndex: 1, explanation: 'Key details help us figure out what the text is mainly about.', difficulty: 'easy' },
    ],
    material: {
      title: 'Reading Comprehension: Main Idea',
      content: 'The main idea is the most important point the author wants you to understand. Key details are facts or examples that support the main idea. To find the main idea, ask: "What is this mostly about?" Sometimes the main idea is stated in a topic sentence; other times you infer it from the details. Summarizing in one sentence helps you check if you got it.',
    },
  },
  3: {
    topicName: 'Grammar: Nouns, Verbs, and Adjectives',
    topicDescription: 'Identify and use nouns, verbs, and adjectives correctly.',
    questions: [
      { text: 'Which word is a noun?', options: ['run', 'quickly', 'school', 'beautiful'], correctIndex: 2, explanation: 'A noun names a person, place, or thing; school is a place.', difficulty: 'easy' },
      { text: 'Which word is a verb?', options: ['happy', 'jump', 'blue', 'table'], correctIndex: 1, explanation: 'A verb shows action; jump is an action.', difficulty: 'easy' },
      { text: 'Which word is an adjective?', options: ['sing', 'loud', 'teacher', 'yesterday'], correctIndex: 1, explanation: 'An adjective describes a noun; loud describes sound.', difficulty: 'easy' },
      { text: 'Choose the correct form: "She ___ every day."', options: ['run', 'runs', 'running', 'runned'], correctIndex: 1, explanation: 'With "she," we use "runs" (third person singular).', difficulty: 'medium' },
      { text: 'Which sentence has the adjective in the right place?', options: ['The red big ball', 'The big red ball', 'The ball red big', 'Big the red ball'], correctIndex: 1, explanation: 'We usually say size before color: big red ball.', difficulty: 'medium' },
    ],
    material: {
      title: 'Grammar: Nouns, Verbs, and Adjectives',
      content: 'Nouns name people, places, things, or ideas. Verbs show action or state of being (e.g., run, is). Adjectives describe nouns (e.g., big, happy). In a sentence, the subject is usually a noun, and the predicate contains the verb. Use correct verb forms: for "he/she/it" in present tense, add -s (e.g., she runs).',
    },
  },
  4: {
    topicName: 'Paragraph Structure and Topic Sentences',
    topicDescription: 'Write clear paragraphs with topic sentences and supporting details.',
    questions: [
      { text: 'A good topic sentence should:', options: ['be the longest sentence', 'state the main idea of the paragraph', 'always be a question', 'come only at the end'], correctIndex: 1, explanation: 'The topic sentence introduces what the paragraph is about.', difficulty: 'easy' },
      { text: 'Supporting sentences in a paragraph should:', options: ['repeat the topic sentence', 'give details and examples about the topic', 'introduce a new topic', 'be shorter than the topic sentence'], correctIndex: 1, explanation: 'Supporting sentences develop the main idea with details.', difficulty: 'easy' },
      { text: 'What often comes after the supporting sentences?', options: ['A new topic sentence', 'A concluding sentence', 'Another paragraph with no link', 'Nothing'], correctIndex: 1, explanation: 'A concluding sentence wraps up the paragraph.', difficulty: 'medium' },
      { text: 'How many main ideas should one paragraph usually have?', options: ['As many as possible', 'One', 'None', 'Two or three'], correctIndex: 1, explanation: 'One paragraph typically focuses on one main idea.', difficulty: 'easy' },
      { text: 'Which is a strong topic sentence?', options: ['Dogs are nice.', 'Dogs can be trained to help people with disabilities.', 'I like dogs.', 'Dogs have fur.'], correctIndex: 1, explanation: 'A strong topic sentence is specific and gives direction for the paragraph.', difficulty: 'medium' },
    ],
    material: {
      title: 'Paragraph Structure and Topic Sentences',
      content: 'A paragraph is a group of sentences about one main idea. Start with a topic sentence that states that idea. Follow with 3–5 supporting sentences that give details, examples, or explanations. End with a concluding sentence that restates or summarizes. Keep one main idea per paragraph; start a new paragraph when you switch to a new idea.',
    },
  },
  5: {
    topicName: 'Reading: Inference and Context Clues',
    topicDescription: 'Make inferences and use context to figure out word meanings.',
    questions: [
      { text: 'When you "infer," you:', options: ['copy the exact words', 'figure out something not directly stated', 'ignore the text', 'only read the title'], correctIndex: 1, explanation: 'Inferring means using clues to figure out what the author implies.', difficulty: 'easy' },
      { text: 'Context clues are:', options: ['words in a dictionary', 'words and sentences around an unknown word that help explain it', 'only in the first sentence', 'never helpful'], correctIndex: 1, explanation: 'Context is the surrounding text that helps you understand meaning.', difficulty: 'easy' },
      { text: 'If a character is "shivering and pulling her coat tight," you might infer:', options: ['She is happy', 'She is cold', 'She is running', 'She is eating'], correctIndex: 1, explanation: 'Shivering and pulling a coat tight suggest she is cold.', difficulty: 'medium' },
      { text: 'The word "enormous" in "The enormous elephant filled the room" probably means:', options: ['tiny', 'very large', 'noisy', 'gray'], correctIndex: 1, explanation: 'Context (filled the room) suggests "enormous" means very large.', difficulty: 'medium' },
      { text: 'Good readers use inference to:', options: ['skip hard words', 'understand character feelings and unstated ideas', 'count sentences', 'memorize the text'], correctIndex: 1, explanation: 'Inference helps us understand what is suggested but not said.', difficulty: 'easy' },
    ],
    material: {
      title: 'Inference and Context Clues',
      content: 'Inference means using clues in the text (and your own knowledge) to figure out what the author does not say directly. Context clues are the words and sentences around an unfamiliar word that help you guess its meaning. Look for definitions, examples, or contrasts nearby. When you infer, ask: "What clues did I use? Does my inference make sense with the whole text?"',
    },
  },
  6: {
    topicName: 'Literary Elements: Plot and Character',
    topicDescription: 'Identify plot structure and character traits in stories.',
    questions: [
      { text: 'The "setting" of a story is:', options: ['the main character', 'when and where the story takes place', 'the moral of the story', 'the title'], correctIndex: 1, explanation: 'Setting is time and place.', difficulty: 'easy' },
      { text: 'The main character in a story is often called the:', options: ['antagonist', 'protagonist', 'narrator', 'author'], correctIndex: 1, explanation: 'The protagonist is the main character the story follows.', difficulty: 'medium' },
      { text: 'The "climax" of a plot is:', options: ['the first scene', 'the turning point or most exciting part', 'the end of the book', 'a description of the setting'], correctIndex: 1, explanation: 'The climax is the peak of the conflict or action.', difficulty: 'medium' },
      { text: 'Character traits are:', options: ['only physical descriptions', 'qualities that describe a character (e.g., brave, kind)', 'always stated in the first sentence', 'the same for every character'], correctIndex: 1, explanation: 'Traits are the qualities that define a character.', difficulty: 'easy' },
      { text: 'What might an author use to show character?', options: ['Only direct statements like "She was brave"', 'Actions, dialogue, and thoughts', 'Only the character\'s name', 'Only the setting'], correctIndex: 1, explanation: 'Authors show character through what characters do, say, and think.', difficulty: 'medium' },
    ],
    material: {
      title: 'Literary Elements: Plot and Character',
      content: 'Plot is the sequence of events: exposition (introduction), rising action, climax (turning point), falling action, resolution. Characters are the people or beings in the story. We learn about them through their actions, dialogue, thoughts, and what others say about them. Setting is when and where the story happens. Theme is the big idea or message the author wants to convey.',
    },
  },
  7: {
    topicName: 'Writing: Argument and Evidence',
    topicDescription: 'Support claims with reasons and evidence.',
    questions: [
      { text: 'In an argument, a "claim" is:', options: ['a question', 'the main point or position you are arguing', 'a piece of evidence', 'the conclusion only'], correctIndex: 1, explanation: 'A claim is the position you want others to accept.', difficulty: 'easy' },
      { text: 'Evidence in an argument should be:', options: ['your opinion only', 'relevant and support your claim', 'longer than the claim', 'unrelated to the topic'], correctIndex: 1, explanation: 'Evidence should back up your claim with facts or examples.', difficulty: 'easy' },
      { text: 'Which is the best evidence to support "Recess helps students focus"?', options: ['Recess is fun.', 'A study showed that students were more attentive after recess.', 'Some kids like recess.', 'Recess is short.'], correctIndex: 1, explanation: 'A study is strong, relevant evidence for the claim.', difficulty: 'medium' },
      { text: 'A "counterargument" is:', options: ['your main claim', 'an opposing view that you then address', 'the same as evidence', 'always wrong'], correctIndex: 1, explanation: 'A counterargument is the other side; you acknowledge and respond to it.', difficulty: 'medium' },
      { text: 'What makes an argument strong?', options: ['Using only one reason', 'Clear claim, reasons, and evidence', 'Long paragraphs', 'Avoiding examples'], correctIndex: 1, explanation: 'Strong arguments have a clear claim and solid reasons and evidence.', difficulty: 'easy' },
    ],
    material: {
      title: 'Writing: Argument and Evidence',
      content: 'An argument essay states a claim (your position), gives reasons for it, and supports those reasons with evidence (facts, statistics, examples, quotes). Acknowledge counterarguments and explain why your position is still stronger. Use transition words (first, moreover, however) to connect ideas. Check that every piece of evidence clearly supports your claim.',
    },
  },
  8: {
    topicName: 'Grammar: Clauses and Complex Sentences',
    topicDescription: 'Use dependent and independent clauses correctly.',
    questions: [
      { text: 'An independent clause:', options: ['cannot stand alone as a sentence', 'can stand alone as a complete sentence', 'has no subject', 'has no verb'], correctIndex: 1, explanation: 'An independent clause has a subject and verb and expresses a complete thought.', difficulty: 'easy' },
      { text: 'A dependent clause:', options: ['is always long', 'cannot stand alone as a sentence', 'has two subjects', 'is the same as a phrase'], correctIndex: 1, explanation: 'A dependent clause depends on another clause to be complete.', difficulty: 'easy' },
      { text: 'Which is a complex sentence?', options: ['I ran. She walked.', 'When it rained, we stayed inside.', 'Running fast.', 'The dog and the cat.'], correctIndex: 1, explanation: 'A complex sentence has one independent and one dependent clause.', difficulty: 'medium' },
      { text: 'Which punctuation often joins two independent clauses?', options: ['A comma only', 'A semicolon or comma + conjunction', 'A period only', 'No punctuation'], correctIndex: 1, explanation: 'Use a semicolon or a comma with a conjunction (and, but, so) to join two independent clauses.', difficulty: 'medium' },
      { text: '"Although it was cold" is:', options: ['a complete sentence', 'a dependent clause', 'an independent clause', 'a run-on'], correctIndex: 1, explanation: '"Although it was cold" does not express a complete thought by itself.', difficulty: 'easy' },
    ],
    material: {
      title: 'Clauses and Complex Sentences',
      content: 'An independent clause is a complete thought (subject + verb). A dependent clause has a subject and verb but cannot stand alone (e.g., "When I woke up"). A complex sentence has at least one independent and one dependent clause. Use a comma after a dependent clause when it comes before the independent clause (e.g., "When it rained, we stayed inside.").',
    },
  },
  9: {
    topicName: 'Analyzing Theme and Author\'s Purpose',
    topicDescription: 'Determine theme and author\'s purpose in literature and nonfiction.',
    questions: [
      { text: 'The "theme" of a story is:', options: ['the plot summary', 'the central idea or message', 'the main character', 'the setting'], correctIndex: 1, explanation: 'Theme is the big idea or lesson the author wants to convey.', difficulty: 'easy' },
      { text: 'Author\'s purpose can be to:', options: ['only entertain', 'inform, persuade, or entertain', 'confuse the reader', 'use long words'], correctIndex: 1, explanation: 'Authors write to inform, persuade, entertain, or a combination.', difficulty: 'easy' },
      { text: 'If a text has many facts and statistics, the purpose is likely to:', options: ['entertain', 'inform', 'persuade with emotion only', 'describe a character'], correctIndex: 1, explanation: 'Facts and statistics are often used to inform.', difficulty: 'medium' },
      { text: 'Theme is usually:', options: ['stated in the first sentence', 'implied; you infer it from the story', 'the same in every story', 'only in nonfiction'], correctIndex: 1, explanation: 'Theme is often not stated directly; readers infer it.', difficulty: 'medium' },
      { text: 'To find the theme, ask:', options: ['What happened?', 'What lesson or big idea does the story suggest?', 'Who is the main character?', 'Where is it set?'], correctIndex: 1, explanation: 'Theme is the underlying message or lesson.', difficulty: 'easy' },
    ],
    material: {
      title: 'Theme and Author\'s Purpose',
      content: 'Theme is the central idea or message of a work—what the author says about life or human nature. It is often implied rather than stated. Author\'s purpose is why the author wrote the text: to inform (explain, teach), to persuade (convince), or to entertain (tell a story, create emotion). Clues: tone, word choice, and the type of evidence used.',
    },
  },
  10: {
    topicName: 'Rhetoric and Persuasive Techniques',
    topicDescription: 'Identify rhetorical devices and persuasive techniques.',
    questions: [
      { text: 'Rhetoric is:', options: ['only negative', 'the art of using language effectively to persuade or inform', 'only in speeches', 'the same as lying'], correctIndex: 1, explanation: 'Rhetoric is the skill of using language to persuade or inform.', difficulty: 'medium' },
      { text: 'An "appeal to ethos" focuses on:', options: ['emotions', 'the speaker\'s credibility and character', 'logic and facts', 'fear'], correctIndex: 1, explanation: 'Ethos appeals to the speaker\'s authority or trustworthiness.', difficulty: 'medium' },
      { text: 'An "appeal to pathos" focuses on:', options: ['logic only', 'emotions', 'statistics', 'the author\'s resume'], correctIndex: 1, explanation: 'Pathos appeals to the audience\'s emotions.', difficulty: 'easy' },
      { text: 'An "appeal to logos" uses:', options: ['only stories', 'logic, evidence, and reasoning', 'only emotions', 'repetition only'], correctIndex: 1, explanation: 'Logos appeals to reason and evidence.', difficulty: 'easy' },
      { text: 'Repetition of a phrase in a speech is often used to:', options: ['confuse the audience', 'emphasize a point and make it memorable', 'shorten the speech', 'avoid evidence'], correctIndex: 1, explanation: 'Repetition can emphasize and make a message stick.', difficulty: 'medium' },
    ],
    material: {
      title: 'Rhetoric and Persuasive Techniques',
      content: 'Rhetoric is the art of using language to persuade or inform. Common appeals: ethos (credibility of the speaker), pathos (emotions), logos (logic and evidence). Other techniques include repetition, rhetorical questions, analogies, and vivid language. Strong arguments often use a mix of these. When analyzing, ask: "What is the author trying to achieve and what techniques do they use?"',
    },
  },
  11: {
    topicName: 'Critical Reading: Bias and Evidence',
    topicDescription: 'Evaluate sources for bias and strength of evidence.',
    questions: [
      { text: 'Bias in a source means:', options: ['the author is famous', 'the author has a preference or slant that affects the content', 'the source is long', 'the source is online'], correctIndex: 1, explanation: 'Bias is a tendency to favor one side or perspective.', difficulty: 'easy' },
      { text: 'A primary source is:', options: ['a summary of other sources', 'a first-hand account or original document', 'always unbiased', 'always written'], correctIndex: 1, explanation: 'Primary sources are from the time or person involved (e.g., letters, diaries).', difficulty: 'medium' },
      { text: 'When evaluating evidence, we should ask:', options: ['Only "Is it long?"', 'Is it relevant, reliable, and sufficient?', 'Only "Do I agree?"', 'Only "Who wrote it?"'], correctIndex: 1, explanation: 'Good evidence is relevant to the claim, from a reliable source, and enough to support the point.', difficulty: 'medium' },
      { text: 'Which might indicate bias?', options: ['Clear citations', 'Loaded language or only one side presented', 'Multiple sources', 'Publication date'], correctIndex: 1, explanation: 'Loaded language and one-sided presentation can indicate bias.', difficulty: 'easy' },
      { text: 'Cross-checking sources means:', options: ['using only one source', 'comparing information from multiple sources to verify', 'copying the same sentence', 'ignoring conflicting information'], correctIndex: 1, explanation: 'Cross-checking helps verify accuracy and spot bias.', difficulty: 'easy' },
    ],
    material: {
      title: 'Critical Reading: Bias and Evidence',
      content: 'Bias is a preference or slant that can affect how information is presented. Consider the author\'s purpose, audience, and what might be left out. Primary sources are first-hand; secondary sources interpret or summarize. Evaluate evidence: Is it relevant? From a reliable source? Sufficient? Cross-check important claims across multiple sources.',
    },
  },
  12: {
    topicName: 'Literary Analysis and Essay Writing',
    topicDescription: 'Analyze literature and write analytical essays.',
    questions: [
      { text: 'A thesis in an analytical essay should:', options: ['be a fact everyone knows', 'make a specific, arguable claim about the text', 'summarize the plot', 'be at least three sentences'], correctIndex: 1, explanation: 'A thesis states your interpretative claim that you will support with evidence.', difficulty: 'medium' },
      { text: 'When analyzing literature, "close reading" means:', options: ['reading quickly', 'paying close attention to specific words, images, and structure', 'only reading the first page', 'ignoring the author'], correctIndex: 1, explanation: 'Close reading focuses on how the text creates meaning.', difficulty: 'medium' },
      { text: 'Textual evidence in a literary essay should be:', options: ['general', 'quoted or paraphrased from the text and explained', 'only from the title', 'longer than your analysis'], correctIndex: 1, explanation: 'Use specific quotes or details and explain how they support your claim.', difficulty: 'easy' },
      { text: 'What does "analysis" add beyond summary?', options: ['Nothing', 'Interpretation of why and how—what it means', 'Only the plot', 'Only the author\'s name'], correctIndex: 1, explanation: 'Analysis interprets meaning, effect, and significance.', difficulty: 'medium' },
      { text: 'A strong literary analysis essay:', options: ['only describes the plot', 'makes a claim and supports it with evidence from the text', 'ignores the author', 'has no thesis'], correctIndex: 1, explanation: 'It argues a point and backs it up with textual evidence.', difficulty: 'easy' },
    ],
    material: {
      title: 'Literary Analysis and Essay Writing',
      content: 'Literary analysis argues an interpretation of a text. Start with a clear thesis—a specific, arguable claim. Support it with textual evidence (quotes or specific details) and analyze how that evidence supports your thesis. Close reading means looking at word choice, imagery, structure, and tone. Go beyond summary to explain why and how the text creates meaning.',
    },
  },
};

// Science topics: one set per grade level (abbreviated for length; same structure as above)
const SCIENCE_TOPICS = {
  K: {
    topicName: 'Living vs. Non-Living',
    topicDescription: 'Tell the difference between living and non-living things.',
    questions: [
      { text: 'Which is a living thing?', options: ['A rock', 'A tree', 'A pencil', 'Water'], correctIndex: 1, explanation: 'A tree grows, needs food/water, and can reproduce.', difficulty: 'easy' },
      { text: 'What do living things need?', options: ['Only sunlight', 'Food, water, and air (or oxygen)', 'Only soil', 'Nothing'], correctIndex: 1, explanation: 'Living things need food, water, and usually air to survive.', difficulty: 'easy' },
      { text: 'Is a butterfly living or non-living?', options: ['Non-living', 'Living', 'Sometimes living', 'Neither'], correctIndex: 1, explanation: 'A butterfly is a living animal.', difficulty: 'easy' },
      { text: 'Which is non-living?', options: ['A flower', 'A dog', 'A book', 'A fish'], correctIndex: 2, explanation: 'A book does not grow, eat, or reproduce.', difficulty: 'easy' },
      { text: 'Do living things grow?', options: ['No', 'Yes', 'Only plants', 'Only animals'], correctIndex: 1, explanation: 'Living things grow and change.', difficulty: 'easy' },
    ],
    material: {
      title: 'Living vs. Non-Living',
      content: 'Living things grow, need food and water, can reproduce, and respond to their environment. Plants, animals, and humans are living. Non-living things do not grow, eat, or reproduce on their own—examples include rocks, water, and toys. Sometimes we observe things (e.g., seeds) that are living but not yet active until they have water and warmth.',
    },
  },
  1: {
    topicName: 'Weather and Seasons',
    topicDescription: 'Describe weather and how seasons change.',
    questions: [
      { text: 'What do we use to measure how hot or cold it is?', options: ['A ruler', 'A thermometer', 'A scale', 'A clock'], correctIndex: 1, explanation: 'A thermometer measures temperature.', difficulty: 'easy' },
      { text: 'Which season comes after winter?', options: ['Fall', 'Summer', 'Spring', 'Winter again'], correctIndex: 2, explanation: 'Spring comes after winter.', difficulty: 'easy' },
      { text: 'Rain and snow are forms of:', options: ['wind', 'precipitation', 'sunshine', 'clouds only'], correctIndex: 1, explanation: 'Precipitation is water falling from the sky (rain, snow, sleet).', difficulty: 'easy' },
      { text: 'What causes day and night?', options: ['The Moon', 'Earth spinning on its axis', 'The Sun moving', 'Clouds'], correctIndex: 1, explanation: 'Day and night are caused by Earth\'s rotation.', difficulty: 'medium' },
      { text: 'Which weather might mean you need a coat?', options: ['Hot and sunny', 'Cold and snowy', 'Warm and cloudy', 'Mild and dry'], correctIndex: 1, explanation: 'Cold and snowy weather means you need a coat.', difficulty: 'easy' },
    ],
    material: {
      title: 'Weather and Seasons',
      content: 'Weather is what the air is like outside: temperature, rain, wind, clouds. We measure temperature with a thermometer. The four seasons—spring, summer, fall, winter—repeat every year because Earth orbits the Sun. Precipitation is water that falls from clouds (rain, snow, sleet). Observing and recording weather helps us see patterns.',
    },
  },
  2: {
    topicName: 'Plants: Parts and Needs',
    topicDescription: 'Identify parts of plants and what they need to grow.',
    questions: [
      { text: 'Which part of a plant takes in water from the soil?', options: ['Leaves', 'Flowers', 'Roots', 'Stem'], correctIndex: 2, explanation: 'Roots absorb water and nutrients from the soil.', difficulty: 'easy' },
      { text: 'What do plants need to make their own food?', options: ['Only water', 'Sunlight, water, and air (CO2)', 'Only soil', 'Only seeds'], correctIndex: 1, explanation: 'Plants use sunlight, water, and carbon dioxide to make food (photosynthesis).', difficulty: 'easy' },
      { text: 'Which part of the plant makes seeds?', options: ['Roots', 'Stem', 'Flower', 'Leaves'], correctIndex: 2, explanation: 'Flowers often produce seeds (or fruit that contains seeds).', difficulty: 'easy' },
      { text: 'Leaves are important because they:', options: ['only look pretty', 'catch sunlight and help make food', 'only hold the plant up', 'only take in water'], correctIndex: 1, explanation: 'Leaves use sunlight to make food for the plant.', difficulty: 'medium' },
      { text: 'What do we call the process by which plants make food?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Evaporation'], correctIndex: 1, explanation: 'Photosynthesis is how plants use light to make food.', difficulty: 'medium' },
    ],
    material: {
      title: 'Plants: Parts and Needs',
      content: 'Plants have roots (absorb water and nutrients), stems (support and carry water), leaves (make food using sunlight), and often flowers (make seeds). They need sunlight, water, air, and usually soil to grow. Photosynthesis is the process in leaves where sunlight, water, and carbon dioxide are used to make sugar (food) and oxygen.',
    },
  },
  3: {
    topicName: 'Habitats and Adaptations',
    topicDescription: 'Understand how animals and plants live in different habitats.',
    questions: [
      { text: 'A habitat is:', options: ['a type of food', 'the natural home or environment of an organism', 'a kind of plant', 'only the ocean'], correctIndex: 1, explanation: 'A habitat is where an organism lives and finds what it needs.', difficulty: 'easy' },
      { text: 'An adaptation is:', options: ['a disease', 'a trait that helps an organism survive in its environment', 'only for plants', 'the same for all animals'], correctIndex: 1, explanation: 'Adaptations are features or behaviors that help survival.', difficulty: 'easy' },
      { text: 'A polar bear\'s white fur helps it:', options: ['stay cool', 'blend in with snow to hunt', 'swim faster', 'dig in soil'], correctIndex: 1, explanation: 'Camouflage helps it hide in the snowy environment.', difficulty: 'medium' },
      { text: 'Which animal might live in a desert?', options: ['A whale', 'A camel', 'A penguin', 'A frog'], correctIndex: 1, explanation: 'Camels are adapted to dry, hot desert conditions.', difficulty: 'easy' },
      { text: 'Plants in dry habitats might have:', options: ['very large leaves', 'thick stems that store water', 'no roots', 'only flowers'], correctIndex: 1, explanation: 'Some desert plants store water in thick stems or leaves.', difficulty: 'medium' },
    ],
    material: {
      title: 'Habitats and Adaptations',
      content: 'A habitat provides food, water, shelter, and space. Organisms have adaptations—body parts or behaviors—that help them survive there. Examples: webbed feet for swimming, thick fur for cold, camouflage for hiding. Plants might have deep roots for water or waxy leaves to reduce water loss. When the environment changes, some organisms may not survive if they cannot adapt.',
    },
  },
  4: {
    topicName: 'States of Matter',
    topicDescription: 'Identify solids, liquids, and gases and how they change.',
    questions: [
      { text: 'Which state of matter has a fixed shape and volume?', options: ['Liquid', 'Gas', 'Solid', 'Plasma'], correctIndex: 2, explanation: 'Solids have a fixed shape and volume.', difficulty: 'easy' },
      { text: 'Water vapor is water in which state?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correctIndex: 2, explanation: 'Water vapor is water in the gas state.', difficulty: 'easy' },
      { text: 'When you heat ice, it:', options: ['stays solid', 'melts into liquid water', 'turns into gas only', 'disappears'], correctIndex: 1, explanation: 'Melting is the change from solid to liquid.', difficulty: 'easy' },
      { text: 'Evaporation is when a liquid changes to:', options: ['solid', 'gas', 'plasma', 'another liquid'], correctIndex: 1, explanation: 'Evaporation is liquid turning into gas (e.g., water to vapor).', difficulty: 'medium' },
      { text: 'Which is an example of a liquid?', options: ['Ice', 'Milk', 'Steam', 'Rock'], correctIndex: 1, explanation: 'Milk takes the shape of its container and has a fixed volume—it\'s a liquid.', difficulty: 'easy' },
    ],
    material: {
      title: 'States of Matter',
      content: 'Matter can be solid (fixed shape and volume), liquid (fixed volume, shape of container), or gas (no fixed shape or volume). Changes of state: melting (solid to liquid), freezing (liquid to solid), evaporation (liquid to gas), condensation (gas to liquid). Heating and cooling cause these changes. Water can exist as ice (solid), liquid water, or vapor (gas).',
    },
  },
  5: {
    topicName: 'Earth\'s Systems: Water Cycle and Weather',
    topicDescription: 'Describe the water cycle and how it affects weather.',
    questions: [
      { text: 'What is the main source of energy for the water cycle?', options: ['The Moon', 'The Sun', 'Wind', 'Earth\'s core'], correctIndex: 1, explanation: 'The Sun heats water, causing evaporation.', difficulty: 'easy' },
      { text: 'When water vapor cools and forms droplets, we get:', options: ['evaporation', 'condensation', 'precipitation', 'runoff'], correctIndex: 1, explanation: 'Condensation forms clouds from water vapor.', difficulty: 'medium' },
      { text: 'Rain, snow, and sleet are forms of:', options: ['evaporation', 'condensation', 'precipitation', 'collection'], correctIndex: 2, explanation: 'Precipitation is when water falls from clouds.', difficulty: 'easy' },
      { text: 'Where does most evaporation on Earth occur?', options: ['From rivers only', 'From oceans and other water bodies', 'From rocks only', 'From plants only'], correctIndex: 1, explanation: 'Oceans and large water bodies provide most evaporation.', difficulty: 'medium' },
      { text: 'The water cycle is:', options: ['a one-time process', 'a continuous cycle of evaporation, condensation, precipitation', 'only in the ocean', 'only in the sky'], correctIndex: 1, explanation: 'Water constantly cycles through the atmosphere, land, and oceans.', difficulty: 'easy' },
    ],
    material: {
      title: 'Water Cycle and Weather',
      content: 'The water cycle: the Sun heats water in oceans, lakes, and soil → evaporation (liquid to vapor). Water vapor rises and cools → condensation (clouds). When droplets get heavy → precipitation (rain, snow). Water runs off or soaks into the ground and eventually returns to oceans and lakes. This cycle drives weather and provides fresh water.',
    },
  },
  6: {
    topicName: 'Cells: The Building Blocks of Life',
    topicDescription: 'Understand that cells are the basic units of life.',
    questions: [
      { text: 'The basic unit of life is the:', options: ['organ', 'tissue', 'cell', 'organ system'], correctIndex: 2, explanation: 'All living things are made of cells.', difficulty: 'easy' },
      { text: 'Which organelle is the "powerhouse" of the cell?', options: ['Nucleus', 'Mitochondria', 'Cell wall', 'Chloroplast'], correctIndex: 1, explanation: 'Mitochondria produce energy (ATP) for the cell.', difficulty: 'medium' },
      { text: 'Plant cells have a cell wall; animal cells:', options: ['always have one too', 'do not have a cell wall', 'have two cell walls', 'only have a nucleus'], correctIndex: 1, explanation: 'Animal cells do not have a cell wall.', difficulty: 'easy' },
      { text: 'The nucleus of a cell contains:', options: ['only water', 'genetic material (DNA)', 'only proteins', 'only energy'], correctIndex: 1, explanation: 'The nucleus holds DNA, which controls the cell.', difficulty: 'medium' },
      { text: 'Cells that have a nucleus are called:', options: ['prokaryotic', 'eukaryotic', 'bacterial', 'non-living'], correctIndex: 1, explanation: 'Eukaryotic cells have a nucleus; prokaryotic cells do not.', difficulty: 'medium' },
    ],
    material: {
      title: 'Cells: The Building Blocks of Life',
      content: 'Cells are the smallest units of life. All living things are made of one or more cells. Key parts: nucleus (holds DNA), mitochondria (energy), cell membrane (boundary). Plant cells also have a cell wall and chloroplasts (for photosynthesis). Cells are classified as prokaryotic (no nucleus, e.g., bacteria) or eukaryotic (have a nucleus, e.g., plants and animals).',
    },
  },
  7: {
    topicName: 'Energy: Forms and Transformations',
    topicDescription: 'Identify forms of energy and how energy is transferred.',
    questions: [
      { text: 'Which is a form of energy?', options: ['Mass', 'Kinetic energy', 'Volume', 'Density'], correctIndex: 1, explanation: 'Kinetic energy is the energy of motion.', difficulty: 'easy' },
      { text: 'When you rub your hands together, mechanical energy is transformed mainly into:', options: ['light', 'sound', 'heat', 'chemical energy'], correctIndex: 2, explanation: 'Friction converts motion into heat.', difficulty: 'medium' },
      { text: 'Energy cannot be created or destroyed; it can only be:', options: ['lost', 'transferred or transformed', 'stored only', 'ignored'], correctIndex: 1, explanation: 'This is the law of conservation of energy.', difficulty: 'medium' },
      { text: 'A battery stores:', options: ['only kinetic energy', 'chemical energy', 'only light', 'only sound'], correctIndex: 1, explanation: 'Batteries store chemical energy that can be converted to electrical.', difficulty: 'easy' },
      { text: 'What type of energy does a moving car have?', options: ['Only potential', 'Kinetic energy', 'Only chemical', 'Only nuclear'], correctIndex: 1, explanation: 'Moving objects have kinetic energy.', difficulty: 'easy' },
    ],
    material: {
      title: 'Energy: Forms and Transformations',
      content: 'Energy exists in many forms: kinetic (motion), potential (stored), chemical, thermal (heat), light, electrical, sound. Energy can be transferred from one object to another or transformed from one form to another (e.g., chemical in battery → electrical → light in a bulb). The total energy in a closed system is conserved—it is not created or destroyed.',
    },
  },
  8: {
    topicName: 'Forces and Motion',
    topicDescription: 'Describe forces and how they affect motion.',
    questions: [
      { text: 'Force is defined as:', options: ['speed', 'a push or pull that can change an object\'s motion', 'only gravity', 'only friction'], correctIndex: 1, explanation: 'Force is a push or pull that can change motion.', difficulty: 'easy' },
      { text: 'What is the unit of force in the metric system?', options: ['Kilogram', 'Newton', 'Meter', 'Second'], correctIndex: 1, explanation: 'Force is measured in newtons (N).', difficulty: 'medium' },
      { text: 'Newton\'s first law says an object at rest stays at rest unless acted on by:', options: ['nothing', 'an unbalanced force', 'only gravity', 'only air'], correctIndex: 1, explanation: 'This is the law of inertia.', difficulty: 'medium' },
      { text: 'Friction often causes:', options: ['motion to increase forever', 'motion to slow down or stop', 'no effect', 'only speed increase'], correctIndex: 1, explanation: 'Friction opposes motion and can slow or stop objects.', difficulty: 'easy' },
      { text: 'Gravity is a force that:', options: ['only acts on Earth', 'pulls objects toward each other (e.g., toward Earth)', 'pushes objects apart', 'only affects liquids'], correctIndex: 1, explanation: 'Gravity is an attractive force between masses.', difficulty: 'easy' },
    ],
    material: {
      title: 'Forces and Motion',
      content: 'A force is a push or pull. Forces can cause objects to start moving, stop, or change direction. Newton\'s laws: (1) An object stays at rest or in motion unless acted on by an unbalanced force. (2) F = ma (force equals mass times acceleration). (3) For every action there is an equal and opposite reaction. Friction opposes motion; gravity pulls objects toward Earth.',
    },
  },
  9: {
    topicName: 'Genetics: Heredity and DNA',
    topicDescription: 'Basic heredity and the role of DNA.',
    questions: [
      { text: 'DNA carries:', options: ['only energy', 'genetic information (instructions for traits)', 'only water', 'only proteins'], correctIndex: 1, explanation: 'DNA holds the genetic code for traits.', difficulty: 'easy' },
      { text: 'Offspring inherit traits from:', options: ['only the mother', 'only the father', 'both parents', 'neither'], correctIndex: 2, explanation: 'Offspring get genes from both parents.', difficulty: 'easy' },
      { text: 'A gene is:', options: ['a type of cell', 'a segment of DNA that codes for a trait', 'only in plants', 'only in animals'], correctIndex: 1, explanation: 'Genes are units of heredity made of DNA.', difficulty: 'medium' },
      { text: 'Which base is not found in DNA?', options: ['Adenine', 'Thymine', 'Uracil', 'Guanine'], correctIndex: 2, explanation: 'Uracil is in RNA; DNA has thymine instead.', difficulty: 'hard' },
      { text: 'Dominant and recessive alleles determine:', options: ['only height', 'many inherited traits', 'only eye color', 'only behavior'], correctIndex: 1, explanation: 'Many traits are influenced by dominant and recessive alleles.', difficulty: 'medium' },
    ],
    material: {
      title: 'Genetics: Heredity and DNA',
      content: 'DNA is the molecule that carries genetic information. Genes are segments of DNA that code for traits. Offspring inherit one set of chromosomes from each parent, so traits come from both. Dominant alleles can mask recessive ones. Understanding genetics helps explain family resemblance and how traits are passed on.',
    },
  },
  10: {
    topicName: 'Evolution and Natural Selection',
    topicDescription: 'Understand how species change over time.',
    questions: [
      { text: 'Natural selection is the process by which:', options: ['organisms choose their traits', 'traits that help survival and reproduction become more common', 'all species stay the same', 'only the strongest always survive'], correctIndex: 1, explanation: 'Organisms with favorable traits are more likely to survive and reproduce.', difficulty: 'medium' },
      { text: 'Evolution is:', options: ['change in a species over time', 'only about individuals', 'always fast', 'only about plants'], correctIndex: 0, explanation: 'Evolution is change in heritable traits in a population over time.', difficulty: 'easy' },
      { text: 'A fossil is:', options: ['a living animal', 'remains or traces of past life', 'only from dinosaurs', 'only found in water'], correctIndex: 1, explanation: 'Fossils are preserved remains or traces of organisms from the past.', difficulty: 'easy' },
      { text: 'Adaptation in evolution means:', options: ['any change', 'a trait that improves survival or reproduction in an environment', 'only behavior', 'only size'], correctIndex: 1, explanation: 'Adaptations are traits that help organisms in their environment.', difficulty: 'medium' },
      { text: 'Evidence for evolution includes:', options: ['only fossils', 'fossils, comparative anatomy, and DNA', 'only living species', 'only one continent'], correctIndex: 1, explanation: 'Multiple lines of evidence support evolution.', difficulty: 'medium' },
    ],
    material: {
      title: 'Evolution and Natural Selection',
      content: 'Evolution is the change in heritable traits in a population over many generations. Natural selection: individuals with traits better suited to the environment are more likely to survive and reproduce, so those traits become more common. Evidence includes fossils, comparative anatomy, and DNA. Adaptations are traits that improve survival and reproduction.',
    },
  },
  11: {
    topicName: 'Chemistry: Atoms and Chemical Reactions',
    topicDescription: 'Basic atomic structure and chemical reactions.',
    questions: [
      { text: 'The smallest unit of an element that still has the properties of that element is the:', options: ['molecule', 'atom', 'cell', 'compound'], correctIndex: 1, explanation: 'Atoms are the basic units of elements.', difficulty: 'easy' },
      { text: 'A chemical reaction:', options: ['only changes appearance', 'forms new substances with different properties', 'cannot be reversed', 'never produces heat'], correctIndex: 1, explanation: 'Chemical reactions produce new substances.', difficulty: 'medium' },
      { text: 'The periodic table organizes elements by:', options: ['color', 'atomic number and properties', 'size only', 'name only'], correctIndex: 1, explanation: 'Elements are arranged by atomic number and show patterns in properties.', difficulty: 'medium' },
      { text: 'In a balanced chemical equation, the number of atoms of each element on the left must equal the number on the right because:', options: ['atoms are created', 'atoms are conserved (not created or destroyed)', 'atoms disappear', 'only molecules matter'], correctIndex: 1, explanation: 'Law of conservation of mass: atoms are conserved.', difficulty: 'medium' },
      { text: 'Which is a compound?', options: ['Oxygen gas (O2)', 'Water (H2O)', 'Nitrogen (N2)', 'Hydrogen (H2)'], correctIndex: 1, explanation: 'A compound has two or more different elements; water is H and O.', difficulty: 'easy' },
    ],
    material: {
      title: 'Atoms and Chemical Reactions',
      content: 'Atoms are the building blocks of matter. Elements are made of one type of atom; compounds are made of two or more elements chemically combined. The periodic table organizes elements by atomic number. In a chemical reaction, bonds break and form, producing new substances. The law of conservation of mass: matter is not created or destroyed in a chemical reaction.',
    },
  },
  12: {
    topicName: 'Earth and Space: Earth\'s Place in the Universe',
    topicDescription: 'Earth\'s motion, solar system, and universe.',
    questions: [
      { text: 'What causes the seasons on Earth?', options: ['Distance from the Sun only', 'The tilt of Earth\'s axis as it orbits the Sun', 'The Moon', 'Only the Sun\'s size'], correctIndex: 1, explanation: 'Earth\'s tilt causes different parts to get more or less direct sunlight.', difficulty: 'medium' },
      { text: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctIndex: 2, explanation: 'Mercury is the closest planet to the Sun.', difficulty: 'easy' },
      { text: 'A light-year is a measure of:', options: ['time', 'distance', 'speed', 'brightness'], correctIndex: 1, explanation: 'A light-year is the distance light travels in one year.', difficulty: 'medium' },
      { text: 'What keeps planets in orbit around the Sun?', options: ['Magnetism', 'Gravity', 'Wind', 'Inertia only'], correctIndex: 1, explanation: 'The Sun\'s gravity keeps the planets in orbit.', difficulty: 'easy' },
      { text: 'The Moon\'s phases are caused by:', options: ['Earth\'s shadow only', 'The relative positions of the Moon, Earth, and Sun', 'The Moon changing shape', 'Only the Sun'], correctIndex: 1, explanation: 'We see different amounts of the lit side of the Moon as it orbits Earth.', difficulty: 'medium' },
    ],
    material: {
      title: 'Earth and Space',
      content: 'Earth orbits the Sun once a year; its tilted axis causes seasons. The Moon orbits Earth; its phases result from how much of the sunlit side we see. The solar system includes the Sun, planets, moons, and smaller bodies. Gravity holds the solar system together. Distances in space are huge; a light-year is the distance light travels in a year.',
    },
  },
};

export { GRADE_LEVELS, MATH_TOPICS, ENGLISH_TOPICS, SCIENCE_TOPICS };
