---@diagnostic disable: lowercase-global
-- comment
--[[
multiline comment
--]]

-- 1. Variables and flow

num = 42       -- can be int or float

s = "a string" -- immutable and can use '',"" or [[]](for multi line)
s = nil        -- Undefines s; lua has garbage collection

-- blocks are denoted by keywords like do/end:

while num < 50 do
  num = num + 1 -- sadly no ++ or += like operators
end

if num > 40 then
  print("over 40")
elseif s ~= "a string" then
  -- equality == ok for strs
  io.write("not over 40\n") -- default stdout
else
  -- Variables are global by default
  thisIsGlobal = 5 -- camelcasing

  -- use local keyword to make a variable local
  local line = io.read() -- Reads next stdin line

  -- string concatenation uses the .. operator:
  print("Winter is comming, " .. line)
end

-- Undefined vars return nil.
-- This is not an error
foo = anUnknownVariable

aBoolValue = false

-- NOTE: only nill and false are falsy; 0 and '' are true!
if not aBoolValue then
  print("it was false")
end

-- 'or' and 'and' are short-circuited.
-- This is similar to the a?b:c operator in C/js
ans = aBoolValue and "yes" or "no" --> 'no'

karlSum = 0
for i = 1, 100 do -- inclusive
  karlSum = karlSum + i
end

-- Use "100, 1, -1" as therange to count down:
fredSum = 0
for j = 100, 1, -1 do
  fredSum = fredSum + j
end

-- In general, the range is begin,end[,step].

-- Another loop construct
repeat
  print("the way of future")
  num = num - 1
until num == 0

-- 2. Functions

function fib(n)
  if n < 2 then
    return 1
  end
  return fib(n - 2) + fib(n - 1)
end

-- closures and anonymous functions are ok:
function adder(x)
  -- return function is created when adder is called
  return function(y)
    return x + y
  end
end

a1 = adder(9)
a2 = adder(36)

print(a1(16)) --> 25
print(a2(64)) --> 100

-- Returns, func calls, and assignments all work
-- with lists that may be mismatched in length.
-- Unmatched receivers are nil;
-- unmatched senders are discarded.

x, y, z = 1, 2, 3, 4
-- Now x = 1, y = 2, z = 3, and 4 is thrown away.

function bar(a, b, c)
  print(a, b, c)
  return 4, 8, 15, 16, 23, 42
end

x, y = bar("zaphod") --> prints "zaphod  nil nil"
-- Now x = 4, y = 8, values 15...42 are discarded.

-- Functions are first-class, may be local/global.
-- These are the same:
function f(x)
  return x * x
end

f = function(x)
  return x * x
end
