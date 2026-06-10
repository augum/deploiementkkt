package bdom.kikwit.web;


import bdom.kikwit.Dto.SourceEnergieRequestDto;
import bdom.kikwit.Dto.SourceEnergieResponseDto;

import bdom.kikwit.Services.SourceEnergieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api")
@CrossOrigin("*")
@Tag(name = "Source d'energie", description = "La gestion des sources d'energie")

public class SourceEnergieController {
    private SourceEnergieService service;
    @PostMapping(path = "/sources")
    @Operation(summary = "Enregistrer une informations sur le personnel")
    public SourceEnergieResponseDto save(@RequestBody SourceEnergieRequestDto requestDto){
        return service.save(requestDto);
    }
    @GetMapping(path = "/sources")
    @Operation(summary = "Liste toutes les sources d'energie")
    public List<SourceEnergieResponseDto> list(){
        return service.getAll();
    }
    @PatchMapping(path = "/sources/{id}")
    @Operation(summary = "Modification d'une source energie")
    public SourceEnergieResponseDto update(@PathVariable Long id, @RequestBody SourceEnergieRequestDto requestDto){
        return  service.update(id,requestDto);
    }
    @DeleteMapping(path = "/sources/{id}")
    @Operation(summary = "Suppression d'une source energie")
    public String delete(@PathVariable Long id){
        return  service.delete(id);
    }
}
