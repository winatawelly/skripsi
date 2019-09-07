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

# 2-input XOR inputs and expected outputs.
xor_inputs = f=open("inputTestWithTeam.txt","r")
if(f.mode == 'r'):
    xor_inputs = eval(f.read())

xor_outputs = f=open("outputTest1.txt","r")
if(f.mode == 'r'):
    xor_outputs = eval(f.read())
    

valid_inputs = f=open("validInputTestWithTeam.txt","r")
if(f.mode == 'r'):
    valid_inputs = eval(f.read())  
valid_outputs = f=open("validOutputTest1.txt","r")
if(f.mode == 'r'):
    valid_outputs = eval(f.read())


def eval_genomes(genomes, config):
    for genome_id, genome in genomes:
        genome.fitness = 1140
        net = neat.nn.FeedForwardNetwork.create(genome, config)
        for xi, xo in zip(xor_inputs, xor_outputs):
            output = net.activate(xi)
            genome.fitness -= (output[0] - xo[0]) ** 2
            genome.fitness -= (output[1] - xo[1]) ** 2

def eval_genome(genome, config):
    fitness = 1140
    net = neat.nn.FeedForwardNetwork.create(genome, config)
    for xi, xo in zip(xor_inputs, xor_outputs):
        output = net.activate(xi)
        fitness -= (output[0] - xo[0]) ** 2
        fitness -= (output[1] - xo[1]) ** 2
    return fitness

def eval_genomes1(genomes, config):
    for genome_id, genome in genomes:
        genome.fitness = 0
        net = neat.nn.FeedForwardNetwork.create(genome, config)
        for xi, xo in zip(xor_inputs, xor_outputs):
            output = net.activate(xi)
            output[0] = round((output[0]*10))
            output[1] = round((output[1]*10))
            if(xo[0]*10 == output[0] and xo[1]*10 == output[1] ):
                genome.fitness += 1
            else :
                if(xo[0]*10 > xo[1]*10 and output[0] > output[1] ):
                    genome.fitness += 0.5
                if(xo[0]*10 < xo[1]*10 and output[0] < output[1] ):
                    genome.fitness += 0.5
                if(xo[0]*10 == xo[1]*10 and output[0] == output[1] ):
                    genome.fitness += 0.5


def run(config_file):
    # Load configuration.
    config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)

    # Create the population, which is the top-level object for a NEAT run.
    p = neat.Population(config)
    
    #continue from last checkpoint
    #p = neat.Checkpointer.restore_checkpoint('test1-config2-4990') # BEST SO FAR
    p = neat.Checkpointer.restore_checkpoint('test2-result')
    # Add a stdout reporter to show progress in the terminal.
    p.add_reporter(neat.StdOutReporter(True))
    stats = neat.StatisticsReporter()
    p.add_reporter(stats)
    p.add_reporter(neat.Checkpointer(50))

    # Run for up to 300 generations.
    #winner = p.run(eval_genomes,1)

    pe = neat.ParallelEvaluator(4,eval_genome)

    for x in range(1):

        winner = p.run(pe.evaluate,1)

        # Display the winning genome.
        print('\nBest genome:\n{!s}'.format(winner))

    # Show output of the most fit genome against training data.
        print('\nOutput:')
        winner_net = neat.nn.FeedForwardNetwork.create(winner,config)
    
        correct_predict = 0
        correct_winner = 0
        
        for xi, xo in zip(valid_inputs, valid_outputs):
            
            output = winner_net.activate(xi)    
            output[0] = round((output[0]))
            output[1] = round((output[1]))
            if(xo[0] == output[0] and xo[1] == output[1] ):
                correct_predict += 1
            if(xo[0] > xo[1] and output[0] > output[1] ):
                correct_winner += 1
            if(xo[0] < xo[1] and output[0] < output[1] ):
                correct_winner += 1
            if(xo[0] == xo[1] and output[0] == output[1] ):
                correct_winner += 1

            
            #print("input {!r}, expected output {!r}, got {!r}".format(xi, xo, output))
        
        print("Prediction accuracy = {!r} ".format(correct_predict))
        print("Winner accuracy = {!r} ".format(correct_winner))
        
        node_names = {-1:'A', -2: 'B', 0:'A XOR B'}

        visualize.draw_net(config, winner, view=False, node_names=node_names)
        visualize.plot_stats(stats, ylog=False, view=False)
        visualize.plot_species(stats, view=False)
    

    #p = neat.Checkpointer.restore_checkpoint('neat-checkpoint-4')
    #p.run(eval_genomes, 10)


if __name__ == '__main__':
    # Determine path to configuration file. This path manipulation is
    # here so that the script will run successfully regardless of the
    # current working directory.
    local_dir = os.path.dirname(__file__)
    config_path = os.path.join(local_dir, 'test2-config')
    run(config_path)