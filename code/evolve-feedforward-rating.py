"""
2-input XOR example -- this is most likely the simplest possible example.
"""

from __future__ import print_function
from decimal import *
import os
import neat
import visualize
import math
import json

# file config for player rating only 
# xor_inputs = f=open("inputTest.txt","r")
# if(f.mode == 'r'):
#     xor_inputs = eval(f.read())

# xor_outputs = f=open("outputTest1.txt","r")
# if(f.mode == 'r'):
#     xor_outputs = eval(f.read())
    

# valid_inputs = f=open("validInputTest.txt","r")
# if(f.mode == 'r'):
#     valid_inputs = eval(f.read())  
# valid_outputs = f=open("validOutputTest1.txt","r")
# if(f.mode == 'r'):
#     valid_outputs = eval(f.read())
######################################## 

# file config for test2 (player ratings with team)
# xor_inputs = f=open("inputTestWithTeam.txt","r")
# if(f.mode == 'r'):
#     xor_inputs = eval(f.read())

# xor_outputs = f=open("outputTest1.txt","r")
# if(f.mode == 'r'):
#     xor_outputs = eval(f.read())
    

# valid_inputs = f=open("validInputTestWithTeam.txt","r")
# if(f.mode == 'r'):
#     valid_inputs = eval(f.read())  
# valid_outputs = f=open("validOutputTest1.txt","r")
# if(f.mode == 'r'):
#     valid_outputs = eval(f.read())
####################################

# file config for test3 (player ratings with team and position)
## Label Encoding
# xor_inputs = f=open("inputTestWithPos.txt","r")
# if(f.mode == 'r'):
#     xor_inputs = eval(f.read())

# xor_outputs = f=open("outputTest1.txt","r")
# if(f.mode == 'r'):
#     xor_outputs = eval(f.read())
    

# valid_inputs = f=open("validInputWithPos.txt","r")
# if(f.mode == 'r'):
#     valid_inputs = eval(f.read())  
# valid_outputs = f=open("validOutputTest1.txt","r")
# if(f.mode == 'r'):
#     valid_outputs = eval(f.read())
######################################

## One Hot
xor_inputs = f=open("./dataset/inputRating1.txt","r")
if(f.mode == 'r'):
    xor_inputs = eval(f.read())

xor_outputs = f=open("./dataset/outputRating1.txt","r")
if(f.mode == 'r'):
    xor_outputs = eval(f.read())
    

valid_inputs = f=open("./dataset/validInputRating.txt","r")
if(f.mode == 'r'):
    valid_inputs = eval(f.read())  
valid_outputs = f=open("./dataset/validOutputRating.txt","r")
if(f.mode == 'r'):
    valid_outputs = eval(f.read())
# ######################################

# ## Binary
# xor_inputs = f=open("inputTestWithPosBinary.txt","r")
# if(f.mode == 'r'):
#     xor_inputs = eval(f.read())

# xor_outputs = f=open("outputTest1.txt","r")
# if(f.mode == 'r'):
#     xor_outputs = eval(f.read())
    

# valid_inputs = f=open("validInputWithPosBinary.txt","r")
# if(f.mode == 'r'):
#     valid_inputs = eval(f.read())  
# valid_outputs = f=open("validOutputTest1.txt","r")
# if(f.mode == 'r'):
#     valid_outputs = eval(f.read())
# ######################################


def eval_genome(genome, config):
    fitness = 1140
    net = neat.nn.FeedForwardNetwork.create(genome, config)
    for xi, xo in zip(xor_inputs, xor_outputs):
        output = net.activate(xi)
        fitness -= (output[0] - xo[0]) ** 2
    return fitness



def run(config_file):
    # Load configuration.
    config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)

    # Create the population, which is the top-level object for a NEAT run.
    p = neat.Population(config)
    
    #continue from last checkpoint
    #p = neat.Checkpointer.restore_checkpoint('test2-result-config3') # BEST SO FAR
    #p = neat.Checkpointer.restore_checkpoint('test3-result-config1')
    # Add a stdout reporter to show progress in the terminal.
    p.add_reporter(neat.StdOutReporter(True))
    stats = neat.StatisticsReporter()
    p.add_reporter(stats)
    p.add_reporter(neat.Checkpointer(50))

    # Run for up to 300 generations.
    #winner = p.run(eval_genomes,1)

    pe = neat.ParallelEvaluator(4,eval_genome)

    for x in range(50):

        winner = p.run(pe.evaluate,100)

        # Display the winning genome.
        print('\nBest genome:\n{!s}'.format(winner))

    # Show output of the most fit genome against training data.
        print('\nOutput:')
        winner_net = neat.nn.FeedForwardNetwork.create(winner,config , display=True)
    
        
        
        for xi, xo in zip(valid_inputs, valid_outputs):
            
            output = winner_net.activate(xi)
            print("input {!r}, expected output {!r}, got {!r}".format(xi, xo, output))
        
        
        node_names = {-1:'A', -2: 'B', 0:'A XOR B'}

        visualize.draw_net(config, winner, view=False, node_names=node_names, name="rating-config1")
        visualize.plot_stats(stats, ylog=False, view=False)
        visualize.plot_species(stats, view=False)
    

    #p = neat.Checkpointer.restore_checkpoint('neat-checkpoint-4')
    #p.run(eval_genomes, 10)


if __name__ == '__main__':
    # Determine path to configuration file. This path manipulation is
    # here so that the script will run successfully regardless of the
    # current working directory.
    local_dir = os.path.dirname(__file__)
    config_path = os.path.join(local_dir, 'rating-config1')
    run(config_path)